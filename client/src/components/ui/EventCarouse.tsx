"use client";
// components/Carousel.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"; // Đảm bảo import đúng component carousel của bạn
import Image from 'next/image';
import { BsCalendar4Event } from "react-icons/bs";
import Link from 'next/link';
import { Button } from './button';

const ImageCarousel = () => {
    const [images, setImages] = useState([]);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/event/image');
                console.log(response.data.images);
                setImages(response.data.images); // Giả định response có key 'images'
            } catch (error) {
                console.error('Error fetching images:', error);
            }
        };

        fetchImages();
    }, []);

    return (
        <div className=' mb-10'>
            <div className='flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                    <BsCalendar4Event />
                    <h1 className='text-2xl py-5 pr-3'>Sự kiện</h1>
                </div>
                <Button className='bg-slate-300 dark:bg-slate-800 size-7 hover:bg-slate-400'>
                    <Link className=' dark:text-white text-sm text-black py-3 hover:scale-110' href={'/event'}>
                    All
                    </Link>
                </Button>
            </div>

            <Carousel>
            <a href='/event'>
            <CarouselContent className=' w-[1200px] h-[800px]'>
                {images.map((image, index) => (
                    <CarouselItem key={index}>
                            <Image
                                src={image}
                                alt={`Image ${index + 1}`}
                                className="object-cover"
                                width={1200}
                                height={800}
                                priority = {index ===0}
                            />
                    </CarouselItem>
                ))}
            </CarouselContent>
            </a>
            <CarouselPrevious />
            <CarouselNext />
        </Carousel>
        </div>
    );
};

export default ImageCarousel;
