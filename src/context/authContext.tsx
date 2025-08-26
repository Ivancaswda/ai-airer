'use client';

import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

type User = {
    id: string;
    name: string;
    userId: string;
    email: string;
    image?: string;
    user_id: string;
};

type AuthContextType = {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    login: (token: string) => void;
    logout: () => void;
    isPrem: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const stored = localStorage.getItem("token");

        if (stored) {
            try {
                const decoded = jwtDecode<User>(stored);
                setToken(stored);
                setUser(decoded);
            } catch (e) {
                console.error("Ошибка декодирования JWT:", e);
                localStorage.removeItem("token");
            }
        }
        setIsLoading(false);
    }, []);

    // 👇 Подгружаем актуальные данные из Convex
    const convexUser = useQuery(api.users.getUserByUserId, { userId: user?.userId ?? "" });

    useEffect(() => {
        if (convexUser) {
            setUser((prev) => ({
                ...prev!,
                ...convexUser, // обновляем isPrem и другие поля из БД
            }));
        }
    }, [convexUser]);

    const login = (newToken: string) => {
        localStorage.setItem("token", newToken);
        const decoded = jwtDecode<User>(newToken);
        setToken(newToken);
        setUser(decoded);
    };

    const logout = () => {
        localStorage.removeItem("token"); // удаляем токен
        setToken(null);
        setUser(null); // сбрасываем состояние пользователя
    };

    return (
        <AuthContext.Provider value={{ user, token, isLoading, login, logout,  }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
};
