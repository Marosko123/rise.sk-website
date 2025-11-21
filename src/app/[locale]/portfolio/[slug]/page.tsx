import { getPortfolioProjects } from '@/data/projects';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import Image from 'next/image';

export default async function ProjectDetail({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const tProjects = await getTranslations({ locale, namespace: 'portfolio.projects' });
  const tRoot = await getTranslations({ locale });
  
  // Helper to get projects with translations
  const projectsWithTrans = getPortfolioProjects((key) => {
    return tProjects(key.replace('portfolio.projects.', ''));
  });

  const project = projectsWithTrans.find(p => p.slug === slug);

  if (!project) notFound();

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 relative h-[400px] w-full rounded-2xl overflow-hidden">
            <Image 
              src={project.image} 
              alt={project.title}
              fill
              className="object-cover"
            />
          </div>
          
          <h1 className="text-4xl font-bold mb-4">{project.title}</h1>
          
          <div className="flex flex-wrap gap-2 mb-8">
            {project.tags.map(tag => (
              <span key={tag} className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-800">
                {tag}
              </span>
            ))}
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="p-6 bg-gray-50 rounded-xl">
              <h3 className="font-bold mb-2 text-gray-900">Status</h3>
              <p className="text-gray-700">{project.metrics.status}</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-xl">
              <h3 className="font-bold mb-2 text-gray-900">Duration</h3>
              <p className="text-gray-700">{project.metrics.duration}</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-xl">
              <h3 className="font-bold mb-2 text-gray-900">Satisfaction</h3>
              <p className="text-gray-700">{project.metrics.satisfaction}</p>
            </div>
          </div>

          <div className="prose max-w-none">
            <p className="text-xl text-gray-600 mb-8">
              {tRoot(`portfolio.projects.descriptions.${project.descriptionKey}`)} 
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
