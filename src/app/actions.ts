"use server";

import { promises as fs } from 'fs';
import path from 'path';
import { revalidatePath } from 'next/cache';

export async function updateContent(newHeroTitle: string, newHeroSubtitle: string, dormPrice: string, privatePrice: string) {
  const filePath = path.join(process.cwd(), 'data.json');
  
  try {
    const fileContents = await fs.readFile(filePath, 'utf8');
    const data = JSON.parse(fileContents);
    
    data.hero.title = newHeroTitle;
    data.hero.subtitle = newHeroSubtitle;
    if(!data.rooms) data.rooms = {};
    data.rooms.dormPrice = dormPrice;
    data.rooms.privatePrice = privatePrice;
    
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
    
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error("Failed to update content", error);
    return { success: false, error: "Failed to update content" };
  }
}

export async function submitBooking(bookingData: { checkIn: string, checkOut: string, guests: string, message: string }) {
  const filePath = path.join(process.cwd(), 'bookings.json');
  
  try {
    let bookings = [];
    try {
      const fileContents = await fs.readFile(filePath, 'utf8');
      bookings = JSON.parse(fileContents);
    } catch(e) {
      // file might not exist or be empty
    }
    
    bookings.push({
      id: Date.now().toString(),
      date: new Date().toISOString(),
      ...bookingData
    });
    
    await fs.writeFile(filePath, JSON.stringify(bookings, null, 2), 'utf8');
    return { success: true };
  } catch (error) {
    console.error("Failed to save booking", error);
    return { success: false, error: "Failed to save booking" };
  }
}

export async function uploadImage(formData: FormData) {
  const file = formData.get('file') as File;
  const fileName = formData.get('fileName') as string;
  
  if (!file || !fileName) {
    return { success: false, error: "Missing file or filename" };
  }
  
  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const filePath = path.join(process.cwd(), 'public', 'images', fileName);
    await fs.writeFile(filePath, buffer);
    
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error("Failed to upload image", error);
    return { success: false, error: "Failed to upload image" };
  }
}

import { cookies } from 'next/headers';

export async function loginAction(password: string) {
  if (password === 'tamraght2026') {
    const cookieStore = await cookies();
    cookieStore.set('admin_auth', 'authenticated', { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production', 
      maxAge: 60 * 60 * 24 
    });
    return { success: true };
  }
  return { success: false };
}

import { redirect } from 'next/navigation';

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete('admin_auth');
  redirect('/admin/login');
}
