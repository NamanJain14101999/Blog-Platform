import {
    collection,
    query,
    where,
    addDoc,
    getDoc,
    getDocs,
    doc,
    updateDoc,
    serverTimestamp,
    onSnapshot,
    orderBy,
} from 'firebase/firestore';
import { db } from '../lib/firebase';

const blogsCol = collection(db, 'blogs');

export const listenPosts = (cb) =>
    onSnapshot(
        query(blogsCol, where('approved', '==', true), orderBy('createdAt', 'desc')),
        (snap) => cb(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    );

export const fetchPosts = async () => {
    const snap = await getDocs(query(blogsCol, orderBy('createdAt', 'desc')));
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const listenPendingPosts = (cb) =>
    onSnapshot(
        query(blogsCol, where('approved', '==', false), orderBy('createdAt', 'desc')),
        (snap) => cb(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    );

export const approvePost = (id) =>
    updateDoc(doc(db, 'blogs', id), { approved: true });

export const fetchPost = async (id) => {
    const snap = await getDoc(doc(db, 'blogs', id));
    return { id: snap.id, ...snap.data() };
};

export const createPost = (payload) =>
    addDoc(blogsCol, {
        ...payload,
        approved: false,
        createdAt: serverTimestamp(),
    });
  