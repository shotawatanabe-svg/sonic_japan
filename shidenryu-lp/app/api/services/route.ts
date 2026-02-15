import { fetchServices } from '@/lib/fetch-services';

export async function GET() {
  const services = await fetchServices();
  return Response.json({ services });
}
