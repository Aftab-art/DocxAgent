import { Themes } from './themes';

const LayoutIds = [
    'modern',
    'twoColumn',
    'professional',
    'minimal',
    'creative',
    'academic',
    'executive',
    'corporate',
    'simple',
    'sidebar'
];

const LayoutThumbnails = {
    modern: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&h=600&fit=crop',
    twoColumn: 'https://images.unsplash.com/photo-1603201667141-5a2d4c673378?w=400&h=600&fit=crop',
    professional: 'https://images.unsplash.com/photo-1586281380117-5a60ae2050cc?w=400&h=600&fit=crop',
    minimal: 'https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?w=400&h=600&fit=crop',
    creative: 'https://images.unsplash.com/photo-1626197031507-c17099753214?w=400&h=600&fit=crop',
    academic: 'https://images.unsplash.com/photo-1544650030-3c9baf6b427a?w=400&h=600&fit=crop',
    executive: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&h=600&fit=crop',
    corporate: 'https://images.unsplash.com/photo-1555421689-491a97ff2040?w=400&h=600&fit=crop',
    simple: 'https://images.unsplash.com/photo-1507679729287-217101758ee5?w=400&h=600&fit=crop',
    sidebar: 'https://images.unsplash.com/photo-1517842645767-c639042777db?w=400&h=600&fit=crop'
};

/**
 * Generate 100+ Template Configurations
 * Combining 10 Layouts with 10 Themes
 */
export const GENERATED_TEMPLATES = (() => {
    const templates = [];
    const themeEntries = Object.entries(Themes);

    LayoutIds.forEach((layoutId) => {
        themeEntries.forEach(([themeId, theme]) => {
            const id = `${layoutId}-${themeId}`;
            templates.push({
                id,
                layout: layoutId,
                theme: themeId,
                name: `${theme.name} ${layoutId.charAt(0).toUpperCase() + layoutId.slice(1)}`,
                description: `A unique blend of the ${layoutId} structure with the ${theme.name} visual style. Ideal for ${layoutId === 'academic' ? 'researchers' : 'professionals'}.`,
                thumbnail: LayoutThumbnails[layoutId] || LayoutThumbnails.modern,
                features: [
                    layoutId === 'twoColumn' ? 'Two Column' : 'Single Column',
                    themeId === 'minimal' ? 'ATS Optimized' : 'Modern Design',
                    'Customizable'
                ]
            });
        });
    });

    return templates;
})();


export const TEMPLATE_CATEGORIES = [
    { id: 'all', name: 'All Templates' },
    { id: 'modern', name: 'Modern' },
    { id: 'professional', name: 'Executive' },
    { id: 'creative', name: 'Creative' },
    { id: 'minimal', name: 'Minimalist' },
];
