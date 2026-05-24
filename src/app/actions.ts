"use server";

import fs from 'fs';
import { promises as fsPromises } from 'fs';
import path from 'path';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function updateContent(newHeroTitle: string, newHeroSubtitle: string, dormPrice: string, privatePrice: string) {
  const filePath = path.join(process.cwd(), 'data.json');
  try {
    const fileContents = await fsPromises.readFile(filePath, 'utf8');
    const data = JSON.parse(fileContents);
    data.hero.title = newHeroTitle;
    data.hero.subtitle = newHeroSubtitle;
    if(!data.rooms) data.rooms = {};
    data.rooms.dormPrice = dormPrice;
    data.rooms.privatePrice = privatePrice;
    await fsPromises.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error("Failed to update content", error);
    return { success: false, error: "Failed to update content" };
  }
}

export async function submitBooking(data: any) {
  const BOOKINGS_FILE = path.join(process.cwd(), 'bookings.json');
  try {
    const booking = {
      ...data,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      status: "pending"
    };
    
    let bookings = [];
    if (fs.existsSync(BOOKINGS_FILE)) {
      bookings = JSON.parse(fs.readFileSync(BOOKINGS_FILE, 'utf-8'));
    }
    
    bookings.push(booking);
    fs.writeFileSync(BOOKINGS_FILE, JSON.stringify(bookings, null, 2));
    
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    console.error('Error saving booking:', error);
    return { success: false };
  }
}

export async function updateBookingStatus(id: string, newStatus: string) {
  const BOOKINGS_FILE = path.join(process.cwd(), 'bookings.json');
  try {
    if (!fs.existsSync(BOOKINGS_FILE)) return { success: false };
    
    let bookings = JSON.parse(fs.readFileSync(BOOKINGS_FILE, 'utf-8'));
    const index = bookings.findIndex((b: any) => b.id === id);
    if (index !== -1) {
      bookings[index].status = newStatus;
      fs.writeFileSync(BOOKINGS_FILE, JSON.stringify(bookings, null, 2));
      revalidatePath('/admin');
      return { success: true };
    }
    return { success: false };
  } catch (error) {
    console.error('Error updating booking status:', error);
    return { success: false };
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
    await fsPromises.writeFile(filePath, buffer);
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error("Failed to upload image", error);
    return { success: false, error: "Failed to upload image" };
  }
}

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

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete('admin_auth');
  redirect('/admin/login');
}
