import {NextRequest, NextResponse} from "next/server";
import axios from 'axios'

export async function POST(req: NextRequest) {
    const {placeName} = req.json()
    const BASE_URL = 'https://places.googleapi.com/v1/places:searchText'

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'X-Google-Api-Key': process.env.GOOGLE_PLACE_API_KEY,
            'X-Google-FieldMask': [
                'places.photos',
                'places.displayName',
                'places.id'
            ]
        }
    };

    try {



    const result = await axios.post(BASE_URL, {
        textQuery: placeName
    }, config)

        const placeRefName = result?.data.places[0].photos[0]?.name
        const photoRefUrl = `photoRefUrlkey=${process.env.GOOGLE_PLACE_API_KEY}`
        return NextResponse.json(photoRefUrl)

    } catch (error) {
        return NextResponse.json({error: error})
    }
}