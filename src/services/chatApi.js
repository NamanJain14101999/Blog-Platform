import {
    collection, addDoc, serverTimestamp, query, orderBy, onSnapshot
} from 'firebase/firestore';
import { db } from '../lib/firebase';

export const listenChat = (postId, cb) =>
    onSnapshot(
        query(collection(db, 'blogs', postId, 'comments'), orderBy('createdAt')),
        (snap) => cb(snap.docs.map((d) => d.data()))
    );

export const sendChat = (postId, msg) =>
    addDoc(collection(db, 'blogs', postId, 'comments'), {
        ...msg,
        createdAt: serverTimestamp(),
    });
  