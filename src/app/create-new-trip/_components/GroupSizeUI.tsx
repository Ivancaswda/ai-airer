import React from 'react'

export const SelectTravelsList = [
    {
        id: 1,
        title: 'Один',
        desc: 'Одинокий путешественник в поисках приключений',
        icon: '🧍‍♂️',
        people: 1,
    },
    {
        id: 2,
        title: 'Пара',
        desc: 'Романтическое путешествие вдвоем',
        icon: '👩‍❤️‍👨',
        people: 2,
    },
    {
        id: 3,
        title: 'Семья',
        desc: 'Весёлый отдых всей семьёй',
        icon: '👨‍👩‍👧‍👦',
        people: 4,
    },
    {
        id: 4,
        title: 'Друзья',
        desc: 'Приключения с друзьями — лучше не бывает!',
        icon: '🧑‍🤝‍🧑',
        people: 3,
    },
]
interface TripDurationProps {
    onSelectedOption: (value: string) => void
}

const GroupSizeUi = ({onSelectedOption}: TripDurationProps) => {
    return (
        <div className='grid grid-cols-2 gap-2 md:grid-cols-4 items-center mt-1'>
            {SelectTravelsList.map((item, index) => (
                <div onClick={() => onSelectedOption(item.title )} className='bg-white cursor-pointer hover:border-primary rounded-2xl p-3 border' key={index}>
                    <h2>{item.icon}</h2>
                    <h2>{item.title}</h2>
                </div>
            ))}
        </div>
    )
}
export default GroupSizeUi
