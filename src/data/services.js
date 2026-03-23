// Services data for phone mockup section
export const phoneServices = [
    {
        id: 1,
        title: '3D Product Rendering',
        description: 'The image your launch page, investor deck, and retail buyer all need, built from a single file. No photoshoot. No retakes. No location scouts.',
        price: 'Project basis',
        stat: '0',
        statLabel: 'Reshoots Required',
        displayLabel: '3D RENDERING',
        testimonial: {
            quote: 'Jux delivered in two weeks what our last studio took three months to get wrong.',
            author: 'Maya Chen',
            title: 'Founder, Aura Botanicals'
        }
    },
    {
        id: 2,
        title: 'Animation & Motion',
        description: 'Rotating views, hero reels, and micro-animations. Built for product pages, social, and anything that needs to move. Files delivered ready for use.',
        price: 'Project basis',
        stat: '60fps',
        statLabel: 'Delivered Standard',
        displayLabel: 'MOTION',
        testimonial: {
            quote: 'Our social stopped the scroll the first day the new assets went live.',
            author: 'Jordan Ellis',
            title: 'Brand Lead, Solstice'
        }
    },
    {
        id: 3,
        title: 'Packshot Sets',
        description: 'Every angle, every SKU, every colorway, consistent, clean, ready. When you reformulate or repackage, we update the files. Not the shoot.',
        price: 'Project basis',
        stat: '∞',
        statLabel: 'SKU Variations',
        displayLabel: 'PACKSHOTS',
        testimonial: {
            quote: 'We rebranded 12 SKUs in a week. That used to mean a week in a studio per product.',
            author: 'Sam Torres',
            title: 'Creative Dir, Vela'
        }
    },
    {
        id: 4,
        title: 'Web & App Development',
        description: 'We build the pages, tools, and experiences your product lives inside. Interactive product viewers. Custom storefronts. Performance-first builds.',
        price: 'Project basis',
        stat: '<2s',
        statLabel: 'Target Load Time',
        displayLabel: 'DEVELOPMENT',
        testimonial: {
            quote: 'They built our custom product configurator in three weeks. The conversion lift was immediate.',
            author: 'Priya Nair',
            title: 'CEO, Luminos Labs'
        }
    }
];

// Laptop services data
export const laptopServices = [
    {
        id: 1,
        title: 'Digital Infrastructure',
        description: 'Not just what\'s visible. The systems underneath: CMS architecture, asset pipelines, deployment, integrations. Built to scale when you do.',
        price: 'Project basis',
        displayLabel: 'INFRASTRUCTURE',
        displayContent: 'System: Optimized',
        testimonial: {
            quote: 'We finally have a pipeline that doesn\'t break every time we update a product page.',
            author: 'Marcus Webb',
            title: 'CTO, Grove Supply'
        }
    },
    {
        id: 2,
        title: 'Creative Direction',
        description: 'Don\'t have a brief? Good. Tell us what\'s not working. We\'ll figure out the rest, from visual concept to final execution.',
        price: 'Project basis',
        displayLabel: 'CREATIVE DIRECTION',
        displayContent: 'Concept → Execution',
        testimonial: {
            quote: 'They asked the right questions before touching a single file.',
            author: 'Isabel Reyes',
            title: 'Founder, FORMA'
        }
    },
    {
        id: 3,
        title: 'Interactive Product Experiences',
        description: 'Configurators, 3D viewers, and AR-ready assets. Let your customer explore the product before they buy it.',
        price: 'Project basis',
        displayLabel: 'INTERACTIVE',
        displayContent: 'Explore in 3D',
        testimonial: {
            quote: 'The 3D viewer turned our product page into something customers actually explored instead of skimmed.',
            author: 'Nina Park',
            title: 'Ecommerce Lead, Northline'
        }
    },
    {
        id: 4,
        title: 'Brand Visual Systems',
        description: 'A consistent visual language across every format, product pages, ads, emails, and retail decks. Built once. Used everywhere.',
        price: 'Project basis',
        displayLabel: 'VISUAL SYSTEM',
        displayContent: 'Assets: Ready',
        testimonial: {
            quote: 'For the first time, our campaigns, decks, and site all felt like they came from the same brand.',
            author: 'Elena Brooks',
            title: 'Marketing Director, Vale Studio'
        }
    }
];

// Navigation links
export const navLinks = [
    { label: 'Work', href: '#services' },
    {
        label: 'Services',
        href: '#services',
        dropdown: [
            {
                section: 'Visual',
                items: [
                    '3D Product Rendering',
                    'Animation & Motion',
                    'Packshot Sets',
                    'Creative Direction',
                ]
            },
            {
                section: 'Digital',
                items: [
                    'Web & App Development',
                    'Digital Infrastructure',
                    'Interactive Product Experiences',
                    'Brand Visual Systems',
                ]
            }
        ]
    },
    { label: 'About', href: '#about' },
    { label: 'Arcade', href: '#arcade' },
    { label: 'Contact', href: '#contact' }
];

// Footer links
export const footerLinks = {
    services: ['3D Rendering', 'Animation & Motion', 'Packshot Sets', 'Web Development', 'Digital Infrastructure', 'Creative Direction'],
    company: ['About', 'Work', 'Arcade', 'Contact'],
    resources: ['Case Studies', 'Process', 'FAQ'],
    locations: ['Remote-first']
};

// Model features
export const modelFeatures = [
    {
        title: 'No hand-offs',
        description: 'Creative and technical under one roof. We own the outcome from concept to delivery.',
        icon: 'link'
    },
    {
        title: 'Built to update',
        description: 'When you reformulate, rebrand, or launch a new SKU, files update, not shoots.',
        icon: 'refresh'
    },
    {
        title: 'DTC-native',
        description: 'We work exclusively with product brands. We know what the category demands.',
        icon: 'package'
    }
];
