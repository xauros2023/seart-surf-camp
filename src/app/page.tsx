import { promises as fs } from 'fs';
import path from 'path';
import ClientHome from '@/components/ClientHome';

export default async function Page() {
  const filePath = path.join(process.cwd(), 'data.json');
  let data = {
    hero: {
      title: "Your Surf & Chill Sanctuary in Tamraght",
      subtitle: "Experience the ultimate Moroccan getaway. Good waves, great vibes, and an unforgettable community."
    }
  };

  try {
    const fileContents = await fs.readFile(filePath, 'utf8');
    data = JSON.parse(fileContents);
  } catch (error) {
    console.error("Could not read data.json, using fallback", error);
  }

  return <ClientHome data={data} />;
}
