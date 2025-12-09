
import { Project, Slide, AIModelId, UserRole } from "../types";

// --- Types for our Mock DB ---

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  workspaceName: string;
}

export interface AnalyticsRecord {
    id: string;
    deckId: string;
    viewer: string;
    action: 'View' | 'Click' | 'Conversion';
    timestamp: Date;
}

// --- Mock Data Store ---

let currentUser: UserProfile | null = null;

// Initialize as empty for production-ready feel
let projects: Project[] = [];

// Initialize as empty
let analyticsLogs: AnalyticsRecord[] = [];

// --- Service Methods ---

export const MockFirebase = {
    auth: {
        login: async (email: string) => {
            return new Promise<UserProfile>((resolve) => {
                setTimeout(() => {
                    currentUser = {
                        id: 'u1',
                        name: 'Alex Designer',
                        email: email,
                        role: UserRole.ADMIN,
                        avatar: 'https://ui-avatars.com/api/?name=Alex+Designer&background=f97316&color=fff',
                        workspaceName: 'Acme Creative'
                    };
                    resolve(currentUser);
                }, 800);
            });
        },
        signup: async (email: string, name: string) => {
            return new Promise<UserProfile>((resolve) => {
                setTimeout(() => {
                    currentUser = {
                        id: 'u2',
                        name: name,
                        email: email,
                        role: UserRole.ADMIN,
                        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=f97316&color=fff`,
                        workspaceName: 'My Workspace'
                    };
                    resolve(currentUser);
                }, 800);
            });
        },
        updateProfile: async (updates: Partial<UserProfile>) => {
            if (currentUser) {
                currentUser = { ...currentUser, ...updates };
            }
            return currentUser;
        },
        getCurrentUser: () => currentUser,
    },
    
    db: {
        getProjects: async () => {
            // Simulate network delay
            return new Promise<Project[]>((resolve) => setTimeout(() => resolve([...projects]), 500));
        },
        createProject: async (project: Project) => {
            projects.unshift(project);
            return project;
        },
        updateProject: async (id: string, updates: Partial<Project>) => {
            const idx = projects.findIndex(p => p.id === id);
            if (idx !== -1) {
                projects[idx] = { ...projects[idx], ...updates, updatedAt: new Date() };
            }
            return projects[idx];
        },
        getAnalytics: async () => {
            return new Promise<AnalyticsRecord[]>((resolve) => setTimeout(() => resolve([...analyticsLogs]), 600));
        },
        logEvent: async (record: AnalyticsRecord) => {
            analyticsLogs.unshift(record);
        }
    }
};
