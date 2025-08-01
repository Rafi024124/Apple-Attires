import dbConnect, { collectionNamesObj } from '@/lib/dbConnect'
import Image from 'next/image'
import Link from 'next/link';
import React from 'react'

export default async function ServicesSection() {
    // const res = await fetch("/services.json");
    const coversCollection =await dbConnect(collectionNamesObj.coversCollection);
    const data = await coversCollection.find({}).toArray();
  console.log(data);
  
  return (
    <div className='grid grid-cols-12 max-w-6xl mx-auto gap-2 p-4'>
      {data.map((item)=>{
        return <div 
        key={item._id}
        className=' md:col-span-6 col-span-12   lg:col-span-4 p-2 mx-auto shadow-md'>
            <Image src={item.image} alt='images' width={314} height={500}
            style={{ objectFit: "contain", height: "200px", width: "314px" }}
            ></Image>
             <div className='flex flex-col'>
                <span className='font-bold'>{item.name}</span>
            <span className='font-bold text-red-500'>Price: ${item.price}</span>
             </div>
             <div>
                <Link 
                href={`/covers/${item._id}`}
                className='text-orange-500'>
                 Arrow Button
                </Link>
             </div>
           
        </div>
      })}
    </div>
  )
}
