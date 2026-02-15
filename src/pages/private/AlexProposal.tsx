import ProposalTemplate, { ProposalConfig } from "../../components/proposal/ProposalTemplate";

const alexConfig: ProposalConfig = {
    meta: {
        reference: "Proposta Privada // Ref: #001-A",
        clientName: "Alex",
        dates: "Proposto: Fev 2026",
        heroTitle: <>The Silent Alps<span className="text-switz-red">.</span></>,
        heroSubtitle: <>para Alex.</>,
        introText: "O silêncio real não é a ausência de som. É a ausência de ruído. Preparamos uma logística invisível para que sua única preocupação seja estar presente.",
        philosophyText: <>"A verdadeira exclusividade não é sobre acesso, é sobre <span className="text-switz-red">ritmo</span>. O mundo exige velocidade; a montanha exige pausa."</>,
        seo: {
            title: "Private Proposal // Alex",
            description: "Acurated Swiss experience designed for Alex. The Peak State protocol.",
            ogImage: "/images/glacier3000.avif"
        }
    },
    images: {
        hero: "/images/glacier3000.avif",
        residence: {
            main: "/images/villars-hero.jpg",
            secondary1: "/images/loft/IMG_8736.jpg",
            secondary2: "/images/apartment-fireplace.jpg",
        },
        host: "/images/caueh-vidal-spring.jpg"
    },
    itinerary: {
        day1: {
            title: <>O Ritual de <br /><span className="text-switz-red">Descompressão.</span></>,
            items: [
                {
                    title: "Gate Pickup.",
                    description: "Busca direta no portão do TGV ou aeroporto. Desse momento em diante, o barulho do mundo diminui e você entra na zona de silêncio.",
                    icon: "map"
                },
                {
                    title: "Léman Session.",
                    description: "Pausa estratégica em Montreux. O primeiro contato com o ar gelado e a água cristalina antes da subida final.",
                    icon: "camera",
                    image: "/images/alex_montreux_update.jpg"
                },
                {
                    title: "The Sanctuary.",
                    description: "Check-in no Loft. Fogo na lareira já acesa, spa termal privado preparado e o primeiro sono profundo que você experimenta em meses.",
                    icon: "lock",
                    image: "/images/apartment-fireplace.jpg"
                }
            ]
        },
        day2: {
            title: <>O Silêncio Absoluto.</>,
            items: [
                {
                    title: "Ski Mastery",
                    description: "Evolução rápida na neve. Enquanto você domina a montanha, capturamos suas melhores curvas com drone 4K para o seu arquivo pessoal.",
                    icon: "mountain",
                    image: "/images/alex_ski_update.jpg"
                },
                {
                    title: "Essential Return",
                    description: "Almoço secreto nos Alpes. Você volta para Londres não apenas descansado, mas revigorado e focado no que importa.",
                    icon: "train",
                    image: "/images/alpine-road-villars.jpg"
                }
            ]
        }
    },
    contact: {
        whatsapp: "https://wa.me/41787002202"
    },
    pricing: {
        currency: "£",
        tiers: [
            { count: 1, price: 1350, total: 1350, label: "VIP Solo (Exclusivo)" },
            { count: 2, price: 1000, total: 2000, label: "2 Pessoas" },
            { count: 3, price: 800, total: 2400, label: "3 Pessoas" },
            { count: 4, price: 700, total: 2800, label: "4 Pessoas (Best Value)" },
        ],
        addOns: [
            { id: "glacier", label: "Glacier 3000 Peak Walk", description: "Ponte suspensa entre picos + Almoço no Botta", price: 120 },
            { id: "night", label: "Extra Night (Villars Loft)", description: "Amplie o seu tempo de descompressão", price: 250 },
        ]
    }
};

export default function AlexProposal() {
    return <ProposalTemplate config={alexConfig} />;
}
