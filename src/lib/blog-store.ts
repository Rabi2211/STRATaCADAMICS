import { collection, deleteDoc, doc, getDocs, onSnapshot, orderBy, query, setDoc, writeBatch } from "firebase/firestore";
import { db } from "./firebase";
import { readJson, writeJson } from "./storage";

export type BlogPost = {
  id: string;
  title: string;
  category: string;
  author: string;
  date: string;
  content: string;
  status?: "Published" | "Drafts";
};

const BLOG_STORAGE_KEY = "strata-blog-posts";
const BLOG_COLLECTION = "blogPosts";
const BLOG_POSTS_UPDATED_EVENT = "strata-blog-posts-updated";

function normalizeBlogPost(post: Partial<BlogPost> | null | undefined): BlogPost {
  const normalized: BlogPost = {
    id: post?.id ?? `blog-${Date.now()}-${Math.random()}`,
    title: post?.title ?? "Untitled post",
    category: post?.category ?? "Style Guide",
    author: post?.author ?? "Store owner",
    date: post?.date ?? "Today",
    content: post?.content ?? "<p>Blog post content coming soon.</p>",
  };

  if (post?.status) {
    normalized.status = post.status;
  }

  return normalized;
}

function toFirestoreBlogPost(post: BlogPost) {
  const session = readJson<{ user?: { id?: string } }>("strata-auth-session");
  return {
    id: post.id,
    title: post.title,
    category: post.category,
    author: post.author,
    date: post.date,
    content: post.content,
    status: post.status ?? "Published",
    ownerUid: session?.user?.id ?? "",
  };
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const firestorePosts = await getFirestoreBlogPosts();
  if (firestorePosts.length > 0) {
    return firestorePosts;
  }

  const localPosts = getStoredBlogPosts();
  if (localPosts.length > 0) {
    return localPosts;
  }

  return [];
}

export async function saveBlogPosts(posts: BlogPost[]): Promise<BlogPost[]> {
  const normalizedPosts = posts.map((post) => normalizeBlogPost(post));
  const persistedPosts = saveStoredBlogPosts(normalizedPosts);
  const firestoreDb = db;

  if (!firestoreDb) {
    return persistedPosts;
  }

  try {
    const querySnapshot = await getDocs(collection(firestoreDb, BLOG_COLLECTION));
    const batch = writeBatch(firestoreDb);

    querySnapshot.forEach((snapshot) => {
      batch.delete(snapshot.ref);
    });

    normalizedPosts.forEach((post) => {
      batch.set(doc(firestoreDb, BLOG_COLLECTION, post.id), toFirestoreBlogPost(post));
    });

    await batch.commit();
  } catch (error) {
    console.warn("Falling back to local blog storage because Firestore is unavailable.", error);
  }

  return persistedPosts;
}

async function getFirestoreBlogPosts(): Promise<BlogPost[]> {
  if (!db) {
    return [];
  }

  try {
    const snapshot = await getDocs(query(collection(db, BLOG_COLLECTION), orderBy("date", "desc")));
    return snapshot.docs
      .map((document) => normalizeBlogPost(document.data() as Partial<BlogPost>))
      .filter((post) => post.status === "Published");
  } catch (error) {
    console.warn("Unable to load blog posts from Firestore, falling back to local storage.", error);
    return [];
  }
}

export function getStoredBlogPosts(): BlogPost[] {
  const value = readJson<Array<Partial<BlogPost>>>(BLOG_STORAGE_KEY);

  if (!Array.isArray(value)) {
    return [];
  }

  return value.map((post) => normalizeBlogPost(post));
}

export function saveStoredBlogPosts(posts: BlogPost[]): BlogPost[] {
  const normalizedPosts = posts.map((post) => normalizeBlogPost(post));
  const savedPosts = writeJson(BLOG_STORAGE_KEY, normalizedPosts);

  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(BLOG_POSTS_UPDATED_EVENT, { detail: savedPosts }));
  }

  return savedPosts;
}

export function subscribeToBlogPosts(listener: (posts: BlogPost[]) => void): () => void {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const handleStorage = (event: StorageEvent) => {
    if (event.key === BLOG_STORAGE_KEY) {
      listener(getStoredBlogPosts());
    }
  };

  const handleBlogUpdate = (event: Event) => {
    const detail = (event as CustomEvent<BlogPost[] | undefined>).detail;
    listener(detail ?? getStoredBlogPosts());
  };

  window.addEventListener("storage", handleStorage);
  window.addEventListener(BLOG_POSTS_UPDATED_EVENT, handleBlogUpdate as EventListener);

  let unsubscribeFirestore: () => void = () => {};
  if (db) {
    unsubscribeFirestore = onSnapshot(
      query(collection(db, BLOG_COLLECTION), orderBy("date", "desc")),
      (snapshot) => {
        const posts = snapshot.docs
          .map((document) => normalizeBlogPost(document.data() as Partial<BlogPost>))
          .filter((post) => post.status === "Published");
        saveStoredBlogPosts(posts);
        listener(posts);
      },
      (error) => {
        console.warn("Unable to subscribe to live blog posts.", error);
      },
    );
  }

  return () => {
    unsubscribeFirestore();
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(BLOG_POSTS_UPDATED_EVENT, handleBlogUpdate as EventListener);
  };
}

export function listenToBlogPosts(listener: (posts: BlogPost[]) => void) {
  if (!db) {
    return () => undefined;
  }

  const q = query(collection(db, BLOG_COLLECTION), orderBy("date", "desc"));
  const unsubscribe = onSnapshot(q, (snapshot) => {
    const posts = snapshot.docs
      .map((doc) => normalizeBlogPost(doc.data() as Partial<BlogPost>))
      .filter((post) => post.status === "Published");
    listener(posts);
  });

  return () => {
    unsubscribe();
  };
}

export async function saveBlogPost(post: BlogPost): Promise<BlogPost> {
  const normalized = normalizeBlogPost(post);
  const saved = saveStoredBlogPosts([
    normalized,
    ...getStoredBlogPosts().filter((existing) => existing.id !== normalized.id),
  ]);

  if (db) {
    try {
      await setDoc(doc(db, BLOG_COLLECTION, normalized.id), toFirestoreBlogPost(normalized), { merge: true });
      return normalized;
    } catch (error) {
      console.warn("Falling back to local blog storage because Firestore is unavailable.", error);
    }
  }

  return saved.find((existing) => existing.id === normalized.id) ?? normalized;
}

export async function deleteBlogPost(postId: string): Promise<void> {
  saveStoredBlogPosts(getStoredBlogPosts().filter((post) => post.id !== postId));

  if (db) {
    try {
      await deleteDoc(doc(db, BLOG_COLLECTION, postId));
    } catch (error) {
      console.warn("Falling back to local blog storage because Firestore is unavailable.", error);
    }
  }
}
