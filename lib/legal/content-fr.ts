import type { LegalPageContent } from './types';

/** Modèle à faire valider par un conseiller juridique avant mise en production. */
export const legalPagesFr: Record<string, LegalPageContent> = {
  privacy: {
    title: 'Politique de confidentialité',
    description:
      'Comment Sarap Kitchen collecte, utilise et protège vos informations personnelles.',
    sections: [
      {
        title: 'Introduction',
        paragraphs: [
          'La présente politique décrit comment nous traitons les informations lorsque vous visitez notre site, utilisez nos services ou interagissez avec des fonctions telles que les espaces de compte facultatifs.',
          'En utilisant le site, vous acceptez cette politique. Sinon, veuillez cesser d’utiliser le site.',
        ],
      },
      {
        title: 'Responsable du traitement',
        paragraphs: [
          'Le site est exploité sous le nom « Sarap Kitchen » (l’« Exploitant »). Pour les demandes relatives à la protection des données, contactez-nous via les coordonnées indiquées sur la page À propos ou l’adresse de contact de l’hébergeur jusqu’à publication d’une boîte dédiée.',
        ],
      },
      {
        title: 'Données collectées',
        paragraphs: [
          'Données d’usage et techniques : pages consultées, localisation approximative dérivée de l’adresse IP, type de navigateur, type d’appareil, référent et horodatages — pour exploiter et améliorer le site.',
          'Compte et authentification : si vous vous connectez à des zones d’administration ou restreintes, notre fournisseur d’authentification (p. ex. Supabase Auth) traite votre adresse e-mail et les identifiants de compte conformément à sa documentation.',
          'Contenu que vous nous transmettez : messages, retours ou autres informations que vous envoyez peuvent être traités pour répondre ou afficher le contenu prévu.',
          'Nous ne vendons pas sciemment vos données personnelles.',
        ],
      },
      {
        title: 'Cookies et technologies similaires',
        paragraphs: [
          'Nous utilisons des cookies et un stockage similaire pour le fonctionnement essentiel, les préférences et, si vous l’acceptez, l’analyse d’audience. Voir notre Politique de cookies pour les types, finalités et choix.',
        ],
      },
      {
        title: 'Finalités',
        paragraphs: [
          'Fournir et sécuriser le site ; mesurer performance et audience ; respecter la loi ; faire respecter nos conditions ; et vous répondre lorsque vous nous contactez.',
        ],
      },
      {
        title: 'Bases légales (UE, Royaume-Uni et juridictions comparables)',
        paragraphs: [
          'Le cas échéant : consentement (p. ex. cookies non essentiels) ; exécution d’un contrat ou mesures précontractuelles ; intérêt légitime (sécurité, analyse, équilibre avec vos droits) ; obligation légale.',
        ],
      },
      {
        title: 'Sous-traitants et partage',
        paragraphs: [
          'Nous faisons appel à des prestataires pour l’hébergement, le stockage, l’authentification et la mesure d’audience (p. ex. Vercel, Supabase). Ils traitent les données sur nos instructions et, le cas échéant, avec des garanties contractuelles.',
        ],
      },
      {
        title: 'Conservation',
        paragraphs: [
          'Nous conservons les données le temps nécessaire aux finalités ci-dessus, sauf obligation légale plus longue. Les journaux techniques peuvent être conservés un temps limité pour la sécurité.',
        ],
      },
      {
        title: 'Transferts internationaux',
        paragraphs: [
          'Les prestataires peuvent traiter des données hors de votre pays. Le cas échéant, nous utilisons des garanties appropriées, par exemple les clauses contractuelles types.',
        ],
      },
      {
        title: 'Vos droits',
        paragraphs: [
          'Selon votre lieu de résidence, vous pouvez disposer d’un droit d’accès, de rectification, d’effacement, de limitation, de portabilité et d’opposition. Vous pouvez retirer votre consentement lorsque le traitement y est fondé (p. ex. cookies optionnels). Vous pouvez introduire une réclamation auprès d’une autorité de contrôle.',
          'Pour exercer vos droits, contactez-nous en décrivant votre demande. Nous pourrons devoir vérifier votre identité.',
        ],
      },
      {
        title: 'Enfants',
        paragraphs: [
          'Le site ne s’adresse pas aux enfants de moins de 13 ans (ou l’âge requis localement). Nous ne collectons pas sciemment de données personnelles auprès d’enfants. Contactez-nous si vous pensez le contraire.',
        ],
      },
      {
        title: 'Modifications',
        paragraphs: [
          'Nous pouvons mettre à jour cette politique. La date de « Dernière mise à jour » en tête de page sera modifiée. L’utilisation continue peut valoir acceptation lorsque la loi le permet.',
        ],
      },
    ],
  },
  terms: {
    title: 'Conditions d’utilisation',
    description:
      'Règles régissant votre utilisation du site Sarap Kitchen et des services associés.',
    sections: [
      {
        title: 'Accord',
        paragraphs: [
          'Les présentes conditions (« Conditions ») régissent l’accès et l’utilisation du site et des services associés (ensemble, le « Service »). En utilisant le Service, vous acceptez ces Conditions.',
        ],
      },
      {
        title: 'Le Service',
        paragraphs: [
          'Nous fournissons du contenu autour des recettes, des articles et des outils facultatifs (p. ex. interfaces d’administration pour utilisateurs autorisés). Nous pouvons modifier ou interrompre des fonctionnalités avec ou sans préavis.',
        ],
      },
      {
        title: 'Comptes',
        paragraphs: [
          'Certaines fonctions peuvent nécessiter un compte. Vous devez fournir des informations exactes et garder vos identifiants confidentiels. Vous êtes responsable de l’activité sous votre compte. Signalez toute utilisation non autorisée.',
        ],
      },
      {
        title: 'Utilisation acceptable',
        paragraphs: [
          'Vous vous engagez à ne pas : violer la loi ; porter atteinte aux droits d’autrui ; tenter d’accès non autorisé ; perturber le Service ; diffuser des logiciels malveillants ; extraire des données de manière nuisible ; ou utiliser le Service pour du marketing non sollicité sans autorisation.',
        ],
      },
      {
        title: 'Propriété intellectuelle',
        paragraphs: [
          'Le Service, y compris design, textes, graphismes, logos et logiciels, appartient à l’Exploitant ou à ses concédants. Licence limitée : consultation et impression pour usage personnel et non commercial, sous réserve des présentes Conditions.',
          'Toute reproduction, représentation publique ou œuvre dérivée sans accord écrit préalable est interdite, sauf exceptions légales.',
        ],
      },
      {
        title: 'Contenu utilisateur',
        paragraphs: [
          'Si vous soumettez du contenu, vous nous accordez une licence non exclusive pour l’héberger, l’afficher et l’utiliser pour exploiter le Service. Vous déclarez disposer des droits nécessaires.',
        ],
      },
      {
        title: 'Liens tiers',
        paragraphs: [
          'Le Service peut renvoyer vers des sites tiers. Nous ne sommes pas responsables de leur contenu ou de leurs pratiques. Consultez leurs conditions et politiques de confidentialité.',
        ],
      },
      {
        title: 'Exclusion de garanties',
        paragraphs: [
          'LE SERVICE EST FOURNI « EN L’ÉTAT » ET « SELON DISPONIBILITÉ » SANS GARANTIE D’AUCUNE SORTE, EXPRESSE OU IMPLICITE, NOTAMMENT DE QUALITÉ MARCHANDE, D’ADÉQUATION À UN USAGE PARTICULIER OU D’ABSENCE DE CONTREFAÇON.',
        ],
      },
      {
        title: 'Limitation de responsabilité',
        paragraphs: [
          'DANS LA MESURE MAXIMALE PERMISE PAR LA LOI, L’EXPLOITANT DÉCLINE TOUTE RESPONSABILITÉ POUR LES DOMMAGES INDIRECTS, ACCESSOIRES, SPÉCIAUX, CONSÉCUTIFS OU PUNITIFS, AINSI QUE POUR TOUTE PERTE DE PROFITS, DE DONNÉES OU DE GOODWILL. LA RESPONSABILITÉ TOTALE NE DÉPASSERA PAS LE PLUS ÉLEVÉ ENTRE (A) LES MONTANTS QUE VOUS NOUS AVEZ PAYÉS AU COURS DES DOUZE MOIS PRÉCÉDANT LA RÉCLAMATION ET (B) CENT DOLLARS AMÉRICAINS SI VOUS NE NOUS AVEZ RIEN PAYÉ.',
          'Certaines juridictions n’admettent pas certaines limitations ; dans ce cas, notre responsabilité est limitée au maximum permis.',
        ],
      },
      {
        title: 'Indemnisation',
        paragraphs: [
          'Vous dégagerez l’Exploitant de toute réclamation liée à votre utilisation du Service, à votre contenu ou à la violation des présentes Conditions, dans la mesure permise par la loi.',
        ],
      },
      {
        title: 'Résiliation',
        paragraphs: [
          'Nous pouvons suspendre ou mettre fin à l’accès en cas de violation des Conditions ou pour des raisons opérationnelles. Les dispositions devant survivre restent en vigueur.',
        ],
      },
      {
        title: 'Droit applicable',
        paragraphs: [
          'Les Conditions sont régies par les lois de la juridiction dans laquelle l’Exploitant est établi, sans égard aux règles de conflit de lois, sous réserve des protections d’ordre public applicables aux consommateurs.',
        ],
      },
      {
        title: 'Contact',
        paragraphs: [
          'Pour toute question sur ces Conditions, contactez-nous via la page À propos ou le moyen de contact publié sur le site.',
        ],
      },
    ],
  },
  disclaimer: {
    title: 'Avertissement',
    description:
      'Limites importantes concernant les recettes, la nutrition et les informations de santé sur Sarap Kitchen.',
    sections: [
      {
        title: 'Information générale uniquement',
        paragraphs: [
          'Les recettes, articles, conseils et contenus connexes ont une vocation informative et éducative générale. Ils ne remplacent pas un avis professionnel.',
        ],
      },
      {
        title: 'Pas un avis médical ou diététique',
        paragraphs: [
          'Rien sur ce site ne constitue un avis médical, nutritionnel ou diététique. Consultez un professionnel de santé qualifié avant de modifier votre alimentation, surtout en cas d’allergies, de pathologies ou de régimes spécifiques.',
        ],
      },
      {
        title: 'Allergènes et sécurité alimentaire',
        paragraphs: [
          'Les ingrédients, marques et risques de contamination croisée varient. Lisez toujours les étiquettes et appliquez les bonnes pratiques d’hygiène. Nous ne garantissons pas l’absence d’allergènes ni l’adéquation à un besoin particulier.',
        ],
      },
      {
        title: 'Résultats variables',
        paragraphs: [
          'Les résultats culinaires dépendent du matériel, des ingrédients, des compétences et de l’environnement. Les valeurs nutritionnelles affichées sont des estimations sauf mention contraire et peuvent différer selon votre préparation.',
        ],
      },
      {
        title: 'Absence de garantie',
        paragraphs: [
          'Le contenu est fourni « en l’état » sans garantie. Vous utilisez les recettes et informations à vos propres risques.',
        ],
      },
      {
        title: 'Ressources externes',
        paragraphs: [
          'Les liens vers des tiers sont fournis à titre indicatif. Nous n’avalisons pas et ne sommes pas responsables du contenu, des produits ou services externes.',
        ],
      },
    ],
  },
  cookies: {
    title: 'Politique de cookies',
    description:
      'Comment Sarap Kitchen utilise les cookies et comment les contrôler.',
    sections: [
      {
        title: 'Qu’est-ce qu’un cookie ?',
        paragraphs: [
          'Les cookies sont de petits fichiers enregistrés sur votre appareil lors d’une visite. Ils aident à mémoriser des paramètres, à maintenir la session si nécessaire et à comprendre l’usage du site.',
        ],
      },
      {
        title: 'Utilisation des cookies',
        paragraphs: [
          'Essentiels : nécessaires au fonctionnement de base (sécurité, répartition de charge, locale ou préférences de consentement).',
          'Analytique : si vous choisissez « Tout accepter » dans la bannière (le cas échéant), nous pouvons utiliser des outils pour mesurer l’audience et les performances — par exemple Vercel Analytics ou des services comparables.',
          'Fonctionnels : des préférences optionnelles (p. ex. thème) peuvent être stockées en stockage local ou via cookies.',
        ],
      },
      {
        title: 'Cookies tiers',
        paragraphs: [
          'Des cookies peuvent être déposés par nos prestataires d’hébergement ou d’analyse. Leur usage est décrit dans leurs politiques respectives.',
        ],
      },
      {
        title: 'Vos choix',
        paragraphs: [
          'Vous pouvez gérer les cookies via la bannière du site (essentiels / tout accepter) lorsque celle-ci est proposée, et via les paramètres de votre navigateur (bloquer ou supprimer). Bloquer les cookies essentiels peut nuire au fonctionnement du site.',
        ],
      },
      {
        title: 'Do Not Track',
        paragraphs: [
          'Il n’existe pas de norme sectorielle uniforme pour « Do Not Track ». Nous privilégions le consentement via la bannière et les réglages du navigateur lorsque c’est applicable.',
        ],
      },
      {
        title: 'Mises à jour',
        paragraphs: [
          'Nous pouvons mettre à jour cette politique lorsque nos pratiques évoluent. Consultez cette page régulièrement. Les changements importants peuvent être reflétés dans la bannière ou la politique de confidentialité.',
        ],
      },
    ],
  },
};
