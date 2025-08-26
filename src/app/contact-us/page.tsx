'use client'
import React, { useState } from "react";
import {Label} from "@/components/ui/label";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {motion} from "motion/react";
import {HeroHighlight, Highlight} from "@/components/ui/hero-highlight";
import {IconBrandFacebook, IconBrandInstagram, IconBrandLinkedin, IconBrandTwitter} from "@tabler/icons-react";

export default function SupportPage() {
    const [category, setCategory] = useState("Ошибка");
    const [message, setMessage] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [status, setStatus] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus("Отправка...");

        try {
            const res = await fetch("/api/sendComplaint", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ category, message, userEmail }),
            });

            const data = await res.json();

            if (res.ok) {
                setStatus("Спасибо! Жалоба отправлена.");
                setCategory("Ошибка");
                setMessage("");
                setUserEmail("");
            } else {
                setStatus(`Ошибка: ${data.error || "Не удалось отправить"}`);
            }
        } catch (error) {
            setStatus("Ошибка сети. Попробуйте позже.");
        }
    };

    const selectTypeOfComplaint = [

        'Ошибка',
        'Вопрос',
        'Предложение',
        'Другое'


    ]

    return (
        <div>
            <HeroHighlight>
                <motion.h1
                    initial={{
                        opacity: 0,
                        y: 20,
                    }}
                    animate={{
                        opacity: 1,
                        y: [20, -5, 0],
                    }}
                    transition={{
                        duration: 0.5,
                        ease: [0.4, 0.0, 0.2, 1],
                    }}
                    className="text-2xl px-4 md:text-4xl lg:text-5xl font-bold text-neutral-700 dark:text-white max-w-4xl leading-relaxed lg:leading-snug text-center mx-auto "
                >
                   AI airer единственная кто ответит на {" "}
                    <Highlight className="text-black dark:text-white">
                        вашу жалобу или просьбу
                    </Highlight>
                </motion.h1>
            </HeroHighlight>
            <div className="max-w-md sm:min-w-[400px] min-w-[100%] mx-auto bg-card/90 backdrop-blur-sm border border-border rounded-lg p-6 mt-10 shadow-md">
                <h2 className="text-2xl font-semibold mb-6 text-center text-blue-700">Форма жалобы</h2>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                    <Label>Почему хотите с нами связаться?</Label>
                    <Select onValueChange={setCategory} value={category}>
                        <SelectTrigger>
                            <SelectValue placeholder="Выберите тип жалобы"/>
                        </SelectTrigger>
                        <SelectContent>
                            {selectTypeOfComplaint.map((s, index) => (
                                <SelectItem value={s} key={index}>{s}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <label className="flex flex-col text-sm text-muted-foreground">
                        Ваш Email (необязательно):
                        <input
                            type="email"
                            value={userEmail}
                            onChange={(e) => setUserEmail(e.target.value)}
                            placeholder="example@mail.com"
                            className="mt-1 p-2 rounded border border-border bg-background text-foreground"
                        />
                    </label>

                    <label className="flex flex-col text-sm text-muted-foreground">
                        Сообщение:
                        <textarea
                            required
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            rows={5}
                            placeholder="Опишите вашу жалобу..."
                            className="mt-1 p-2 rounded border border-border bg-background text-foreground resize-none"
                        />
                    </label>

                    <button
                        type="submit"
                        className="bg-blue-700 text-gray-50 py-3 rounded hover:bg-blue-700/90 transition-colors font-semibold"
                    >
                        Отправить
                    </button>
                </form>

                {status && (
                    <p className="mt-4 text-center text-sm text-muted-foreground">{status}</p>
                )}
            </div>
            <footer className="bg-blue-700 dark:bg-black text-white py-12 mt-20">
                <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
                    {/* Логотип и описание */}
                    <div className="text-center md:text-left">
                        <img src='/logo.png'  alt='logo' className='w-[120px]  rounded-3xl h-[110px]'/>
                        <p className="mt-2 text-sm text-blue-100 max-w-xs">
                            Мы помогаем планировать идеальные путешествия с помощью AI. Персонализированные маршруты и уникальные впечатления для каждого.
                        </p>
                    </div>

                    {/* Ссылки */}
                    <div className="flex flex-col md:flex-row gap-8">
                        <div className="flex flex-col gap-2 text-center md:text-left">
                            <h3 className="font-semibold">Компания</h3>
                            <a href="#" className="hover:underline text-blue-100">О нас</a>
                            <a href="#" className="hover:underline text-blue-100">Вакансии</a>
                            <a href="#" className="hover:underline text-blue-100">Контакты</a>
                        </div>
                        <div className="flex flex-col gap-2 text-center md:text-left">
                            <h3 className="font-semibold">Помощь</h3>
                            <a href="#" className="hover:underline text-blue-100">FAQ</a>
                            <a href="#" className="hover:underline text-blue-100">Поддержка</a>
                            <a href="#" className="hover:underline text-blue-100">Блог</a>
                        </div>
                    </div>

                    {/* Социальные сети */}
                    <div className="flex gap-4">
                        <a href="#" className="hover:text-blue-300">
                            <IconBrandFacebook size={24} />
                        </a>
                        <a href="#" className="hover:text-blue-300">
                            <IconBrandTwitter size={24} />
                        </a>
                        <a href="#" className="hover:text-blue-300">
                            <IconBrandInstagram size={24} />
                        </a>
                        <a href="#" className="hover:text-blue-300">
                            <IconBrandLinkedin size={24} />
                        </a>
                    </div>
                </div>

                {/* Копирайт */}
                <div className="mt-10 text-center text-sm text-blue-100">
                    © {new Date().getFullYear()} AI-Airer. Все права защищены. <hr/>
                    Сделано Иваном Катковским
                </div>
            </footer>
        </div>
        );
}
