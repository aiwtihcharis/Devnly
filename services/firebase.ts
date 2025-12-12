import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  updateProfile,
  onAuthStateChanged,
  User 
} from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { UserProfile, UserRole } from "../types";

// Configuration from environment variables
// Ensure these variables are set in your build environment
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || process.env.FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID || process.env.FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Real Authentication Service
export const FirebaseAuth = {
  login: async (email: string, password: string): Promise<UserProfile> => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return await mapUserToProfile(userCredential.user);
  },

  signup: async (email: string, password: string, name: string): Promise<UserProfile> => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update Auth Profile
    if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
            displayName: name,
            photoURL: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=f97316&color=fff`
        });
    }

    // Create User Document in Firestore
    const userProfile: UserProfile = {
      id: userCredential.user.uid,
      name,
      email,
      role: UserRole.ADMIN, // Default first user to Admin
      avatar: userCredential.user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=f97316&color=fff`,
      workspaceName: `${name.split(' ')[0]}'s Workspace`
    };

    await setDoc(doc(db, "users", userCredential.user.uid), {
      ...userProfile,
      createdAt: new Date().toISOString()
    });

    return userProfile;
  },

  logout: async () => {
    await signOut(auth);
  },

  updateUserProfile: async (uid: string, data: Partial<UserProfile>) => {
     const userRef = doc(db, "users", uid);
     await updateDoc(userRef, data);
     return data;
  },

  // Real-time listener for Auth State
  subscribeToAuth: (callback: (user: UserProfile | null) => void) => {
    return onAuthStateChanged(auth, async (user) => {
      if (!user) {
        callback(null);
      } else {
        const profile = await mapUserToProfile(user);
        callback(profile);
      }
    });
  }
};

// Helper to map Firebase User to App Profile
async function mapUserToProfile(user: User): Promise<UserProfile> {
  // Attempt to get extra data from Firestore
  try {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      const userData = userDoc.exists() ? userDoc.data() : {};
      
      return {
        id: user.uid,
        name: user.displayName || userData.name || 'User',
        email: user.email || userData.email || '',
        avatar: user.photoURL || userData.avatar || '',
        role: userData.role || UserRole.VIEWER,
        workspaceName: userData.workspaceName || 'My Workspace'
      };
  } catch (error) {
      console.warn("Failed to fetch user profile from Firestore, using Auth data only", error);
      return {
        id: user.uid,
        name: user.displayName || 'User',
        email: user.email || '',
        avatar: user.photoURL || '',
        role: UserRole.VIEWER,
        workspaceName: 'My Workspace'
      };
  }
}
