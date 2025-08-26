'use client';

import { useState } from "react";
import {useAction, useMutation} from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { useRouter } from "next/navigation";
import {motion} from "framer-motion";
import Image from "next/image";
import { auth, provider } from "@/lib/firebase";
import { signInWithPopup } from "firebase/auth";
import {useTheme} from "next-themes";
import {useAuth} from "@/context/authContext";
import {Button} from "@/components/ui/button";
import {Loader2Icon} from "lucide-react";
import {FaGoogle} from "react-icons/fa";
import {BiLogoGoogle} from "react-icons/bi";

export default function SignUpForm() {
    const register = useAction(api.auth.registerUser);
    const registerOAuthUser = useAction(api.auth.registerOAuthUser);
    const router = useRouter();
    const {  login: setLogin,} = useAuth()
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
    });

    const [error, setError] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const [loading, setLoading] = useState<boolean>(false)
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        try {
            setLoading(true)
            const user = await register(form);

            const token = await fetch("/api/jwt", {
                method: "POST",
                body: JSON.stringify(user),
                headers: { "Content-Type": "application/json" },
            }).then((res) => res.json()).then(res => res.token);


            setLogin(token);

            router.push("/");
        } catch (err: any) {
            setError(err.message || "Ошибка регистрации");
        } finally {
            setLoading(false)
        }
    };


    const handleGoogleSignUp = async () => {
        setError("");
        try {
            setLoading(true);
            const result = await signInWithPopup(auth, provider);
            const user = result.user;


            const convexUser = await registerOAuthUser({
                userId: user.uid,
                name: user.displayName ?? "Без имени",
                email: user.email!,
                image: user.photoURL ?? undefined,
            });


            const token = await fetch("/api/jwt", {
                method: "POST",
                body: JSON.stringify(convexUser),
                headers: { "Content-Type": "application/json" },
            })
                .then((res) => res.json())
                .then((res) => res.token);

            setLogin(token);
            router.push("/");
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Ошибка при входе через Google");
        } finally {
            setLoading(false);
        }
    };



    if (loading) {
        return <div className='flex items-center justify-center w-full h-full'>
            <Loader2Icon className='animate-spin text-violet-500'/>
        </div>;
    }
    return (
        <div className='min-h-screen relative'>

            <div className="  md:flex items-center mt-10 justify-between px-10 gap-2 md:gap-20">
                {/* Левая часть с изображением */}
                <motion.div
                    initial={{opacity: 0, x: -50}}
                    animate={{opacity: 1, x: 0}}
                    transition={{duration: 0.8, ease: "easeOut"}}
                    className="bg-cover bg-center hidden md:block"
                >
                    <Image src={'/logo.png'} width={500} height={500} alt="Educatify Logo"/>
                </motion.div>

                {/* Правая часть с формой */}
                <div className=" w-full md:w-1/2 flex items-center justify-center   text-white md:px-3 lg:px-8">
                    <form onSubmit={handleSubmit} className="space-y-5 w-full max-w-md">
                        <h2 className="text-3xl font-bold text-blue-600">Добро пожаловать</h2>
                        <p className="text-sm text-gray-400">Введите ваше имя, email и пароль для регистрации</p>

                        <div className="relative w-full">
                            <input
                                id="name"
                                name="name"
                                type="text"
                                value={form.name}
                                onChange={handleChange}
                                required
                                placeholder=" "
                                className="peer w-full px-4 pt-5 pb-2 text-white bg-gray-900 border border-gray-700 rounded-md placeholder-transparent focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            />
                            <label
                                htmlFor="name"
                                className="absolute left-2 top-1 text-sm text-gray-500 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-[-10px] px-2 rounded-lg peer-focus:bg-gray-800 peer-focus:text-sm peer-focus:text-blue-500"
                            >
                                Имя
                            </label>
                        </div>

                        <div className="relative w-full">
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={form.email}
                                onChange={handleChange}
                                required
                                placeholder=" "
                                className="peer w-full px-4 pt-5 pb-2 text-white bg-gray-900 border border-gray-700 rounded-md placeholder-transparent focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            />
                            <label
                                htmlFor="email"
                                className="absolute left-2 top-1 text-sm text-gray-500 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-[-10px] px-2 rounded-lg peer-focus:bg-gray-800 peer-focus:text-sm peer-focus:text-blue-500"
                            >
                                Email
                            </label>
                        </div>

                        <div className="relative w-full">
                            <input
                                id="password"
                                name="password"
                                type="password"
                                value={form.password}
                                onChange={handleChange}
                                required
                                placeholder=" "
                                className="peer w-full px-4 pt-5 pb-2 text-white bg-gray-900 border border-gray-700 rounded-md placeholder-transparent focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            />
                            <label
                                htmlFor="password"
                                className="absolute left-2 top-1 text-sm text-gray-500 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-[-10px] px-2 rounded-lg peer-focus:bg-gray-800 peer-focus:text-sm peer-focus:text-blue-500"
                            >
                                Пароль
                            </label>
                        </div>

                        {error && <p className="text-blue-400 text-sm">{error}</p>}

                        <button
                            type="submit"
                            className="w-full hover:scale-105 transition bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition duration-200"
                        >
                            Зарегистрироваться
                        </button>
                        <div className='flex items-center gap-2 justify-center'>
                            <Button onClick={handleGoogleSignUp}
                                type="button"
                                className=" text-sm hover:scale-105 border border-gray-500 cursor-pointer w-full py-6  hover:bg-gray-200 transition  flex items-center justify-center gap-4   text-center font-semibold py-3 bg-white text-black rounded-md transition duration-200"
                            >

                                <FaGoogle width={30} height={30} />
                                <p className='lg:flex hidden'>С помощью Google</p>
                            </Button>
                        </div>



                        <p className="text-sm text-gray-500 text-center">
                            Уже есть аккаунт? <a href="/sign-in" className="text-blue-500 hover:underline">Войти</a>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}
