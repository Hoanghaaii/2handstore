"use client";
// components/Carousel.js

import { useEffect } from 'react';
import { useEventStore } from '@/store/evenStore';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import Image from 'next/image';
import { BsCalendar4Event } from "react-icons/bs";
import Link from 'next/link';
import { Button } from './button';

const ImageCarousel = () => {
    const { fetchEvents, events } = useEventStore();

    useEffect(() => {
        const fetchImages = async () => {
            try {
                await fetchEvents();
                console.log(`Fetched events: ${events}`);
            } catch (error) {
                console.error('Error fetching events:', error);
            }
        };

        fetchImages();
    }, [fetchEvents, events]);

    return (
        <div className='mb-10'>
            <div className='flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                    <BsCalendar4Event />
                    <h1 className='text-2xl py-5 pr-3'>Sự kiện</h1>
                </div>
                <Button className='bg-slate-300 dark:bg-slate-800 size-7 hover:bg-slate-400'>
                    <Link className='dark:text-white text-sm text-black py-3 hover:scale-110' href={'/event'}>
                        All
                    </Link>
                </Button>
            </div>

            <Carousel>
                <CarouselContent className='w-[1200px] h-[800px]'>
                    {events.map((event, index) => (
                        <CarouselItem key={index}>
                            <Image
                                src={event.imageUrl} // Get imageUrl from event
                                alt={`Image ${index + 1}`}
                                className="object-cover"
                                width={1200}
                                height={800}
                                priority={index === 0}
                            />
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
        </div>
    );
};

export default ImageCarousel;
