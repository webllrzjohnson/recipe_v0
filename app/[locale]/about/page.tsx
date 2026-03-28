import { getTranslations, setRequestLocale } from 'next-intl/server';
import Image from 'next/image';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ChefHat, Heart, Users } from 'lucide-react';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'about' });

  return {
    title: t('title'),
    description: t('subtitle'),
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'about' });

  const values = [
    {
      icon: Heart,
      title: locale === 'fr' ? 'Fait avec Amour' : 'Made with Love',
      description:
        locale === 'fr'
          ? 'Chaque recette est préparée et testée avec soin et passion.'
          : 'Every recipe is prepared and tested with care and passion.',
    },
    {
      icon: Users,
      title: locale === 'fr' ? 'Pour Tous' : 'For Everyone',
      description:
        locale === 'fr'
          ? 'Des instructions claires pour les débutants comme les experts.'
          : 'Clear instructions for beginners and experts alike.',
    },
    {
      icon: ChefHat,
      title: locale === 'fr' ? 'Authentique' : 'Authentic',
      description:
        locale === 'fr'
          ? 'Recettes traditionnelles transmises de génération en génération.'
          : 'Traditional recipes passed down through generations.',
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5 py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="font-serif text-4xl font-bold text-foreground sm:text-5xl">
                {t('title')}
              </h1>
              <p className="mt-6 text-lg text-muted-foreground">
                {t('subtitle')}
              </p>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                <Image
                  src="https://placehold.co/800x600/C0392B/FFFFFF?text=Our+Kitchen"
                  alt="Our kitchen"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h2 className="font-serif text-3xl font-bold text-foreground">
                  {t('story')}
                </h2>
                <p className="mt-6 text-muted-foreground leading-relaxed">
                  {t('storyText')}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="bg-secondary/30 py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div className="order-2 lg:order-1">
                <h2 className="font-serif text-3xl font-bold text-foreground">
                  {t('mission')}
                </h2>
                <p className="mt-6 text-muted-foreground leading-relaxed">
                  {t('missionText')}
                </p>
              </div>
              <div className="relative order-1 aspect-[4/3] overflow-hidden rounded-2xl lg:order-2">
                <Image
                  src="https://placehold.co/800x600/F39C12/FFFFFF?text=Cooking+Together"
                  alt="Cooking together"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <h2 className="font-serif text-3xl font-bold text-foreground">
                {locale === 'fr' ? 'Nos Valeurs' : 'Our Values'}
              </h2>
            </div>
            <div className="grid gap-8 sm:grid-cols-3">
              {values.map((value) => (
                <div key={value.title} className="text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <value.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-serif text-xl font-semibold text-foreground">
                    {value.title}
                  </h3>
                  <p className="mt-2 text-muted-foreground">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
