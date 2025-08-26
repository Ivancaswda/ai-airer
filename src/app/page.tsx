'use client'
import React from 'react'
import Hero from "@/app/_components/Hero";
import {PopularCityList} from "@/app/_components/PopularCityList";
import WorldMapDemo from "@/app/_components/WorldHero";
import {AnimatedTestimonials} from "@/components/ui/animated-testimonials";
import {IconBrandFacebook, IconBrandInstagram, IconBrandLinkedin, IconBrandTwitter} from "@tabler/icons-react";
import Image from "next/image";
import {useAuth} from "@/context/authContext";

const HomePage = () => {
    const {user}  = useAuth()
    console.log(user)
    const testimonials = [
        {
            quote:
                "AI-Airer полностью изменил мой подход к планированию путешествий. Персонализированные маршруты экономят время и вдохновляют на новые открытия.",
            name: "Алексей Смирнов",
            designation: "Блогер-путешественник",
            src: "https://upload.wikimedia.org/wikipedia/ru/thumb/d/db/Смирнов_Алексей_Макарович_%28фронтовая%29.jpg/960px-Смирнов_Алексей_Макарович_%28фронтовая%29.jpg",
        },
        {
            quote:
                "С AI-Airer организация поездки стала простой и увлекательной. Я могу сразу видеть лучшие маршруты и уникальные впечатления.",
            name: "Мария Иванова",
            designation: "Журналистка о путешествиях",
            src: "https://avatars.mds.yandex.net/i?id=f5d14528dbed9a36736470ba649c8885_sr-12490006-images-thumbs&n=13",
        },
        {
            quote:
                "Благодаря AI-Airer я открыл для себя места, о которых раньше даже не думал. Отличный помощник для планирования отпусков.",
            name: "Дмитрий Козлов",
            designation: "Фотограф-путешественник",
            src: "https://www.samddn.ru/upload/iblock/480/utd4um_5p1tkbbxnd3rx2fylo5sblamgvgdmzeu6ehgv22cvfu5eyz_gcwpj9_xgjowwwasjbk4vlehqi_cjpv1.jpg",
        },
        {
            quote:
                "AI-Airer экономит мое время и помогает найти уникальные впечатления. Это будущее планирования поездок.",
            name: "Екатерина Петрова",
            designation: "Эксперт по туризму",
            src: "https://avatars.mds.yandex.net/i?id=0d2c46266e8db4dad7da284944d54724_l-4268599-images-thumbs&n=13",
        },
        {
            quote:
                "Сервис AI-Airer невероятно удобен и точен. Все маршруты продуманы до мелочей — путешествия стали намного проще.",
            name: "Игорь Соколов",
            designation: "Бизнесмен и путешественник",
            src: "https://avatars.mds.yandex.net/i?id=2b57f95bed9c54520d17d3e66bb335a16532407b-5587324-images-thumbs&n=13",
        },
    ];
    const companies = [
        {
            name: "Google",
            logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
        },
        {
            name: "Sber",
            logo: "https://avatars.mds.yandex.net/i?id=2d4685df7f756ca0112a9b170e541059_l-5519086-images-thumbs&n=13",
        },
        {
            name: "Pepsi",
            logo: "https://avatars.mds.yandex.net/i?id=84dbc8dbb07f00a00c387f257fe30f219ebcd7b4-12490070-images-thumbs&n=13",
        },
        {
            name: "Positive Technologies",
            logo: "https://avatars.mds.yandex.net/i?id=80f2a0bfc50fa2dbf2b2d97ca399270f1bf4e6f6-4402005-images-thumbs&n=13",
        },
        {
            name: "Google",
            logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
        },
        {
            name: "Sber",
            logo: "https://avatars.mds.yandex.net/i?id=2d4685df7f756ca0112a9b170e541059_l-5519086-images-thumbs&n=13",
        },
        {
            name: "Pepsi",
            logo: "https://avatars.mds.yandex.net/i?id=84dbc8dbb07f00a00c387f257fe30f219ebcd7b4-12490070-images-thumbs&n=13",
        },
        {
            name: "Positive Technologies",
            logo: "https://avatars.mds.yandex.net/i?id=80f2a0bfc50fa2dbf2b2d97ca399270f1bf4e6f6-4402005-images-thumbs&n=13",
        },
    ];
    return (
        <div className='bg-[#F0F4FF]'>
            <WorldMapDemo/>
            <Hero/>
            <PopularCityList/>
            <AnimatedTestimonials testimonials={testimonials} />;

            <div className="w-full overflow-hidden bg-[#F0F4FF] py-10">
                <h3 className="text-center text-2xl md:text-4xl font-bold text-blue-700 mb-8">
                    Нам доверяют
                </h3>
                <div className="relative">
                    <div className="flex animate-scroll space-x-10">
                        {companies.concat(companies).map((company, idx) => (
                            <div
                                key={idx}
                                className="flex items-center justify-center w-48 h-24 bg-white rounded-lg shadow-md"
                            >
                                <img
                                    src={company.logo}
                                    alt={company.name}
                                    className="h-12 object-contain"
                                />
                            </div>
                        ))}
                    </div>
                </div>
                <style jsx>{`
        .animate-scroll {
          display: flex;
          width: calc(200% + 10px);
          animation: scroll 20s linear infinite;
        }
        @keyframes scroll {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
            </div>

            <footer className="bg-blue-700 dark:bg-black text-white py-12">
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
    )
}
export default HomePage
