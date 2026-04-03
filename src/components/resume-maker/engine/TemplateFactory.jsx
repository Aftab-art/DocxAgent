import React from 'react';
import ModernLayout from './layouts/Modern';
import TwoColumnLayout from './layouts/TwoColumn';
import ProfessionalLayout from './layouts/Professional';
import MinimalLayout from './layouts/Minimal';
import CreativeLayout from './layouts/Creative';
import AcademicLayout from './layouts/Academic';
import ExecutiveLayout from './layouts/Executive';
import CorporateLayout from './layouts/Corporate';
import SimpleLayout from './layouts/Simple';
import SidebarLayout from './layouts/Sidebar';
import { Themes } from './themes';

const Layouts = {
    modern: ModernLayout,
    twoColumn: TwoColumnLayout,
    professional: ProfessionalLayout,
    minimal: MinimalLayout,
    creative: CreativeLayout,
    academic: AcademicLayout,
    executive: ExecutiveLayout,
    corporate: CorporateLayout,
    simple: SimpleLayout,
    sidebar: SidebarLayout,
};

/**
 * TemplateFactory Component
 * Resolves layoutId and themeId to render the correct resume component.
 * 
 * @param {string} layoutId - ID of the structural layout
 * @param {string} themeId - ID of the visual style theme
 * @param {object} data - Resume data (Experience, Skills, Education, etc.)
 */
const TemplateFactory = ({ layoutId, themeId, data }) => {
    const Layout = Layouts[layoutId] || Layouts.modern;
    const theme = Themes[themeId] || Themes.minimal;

    return (
        <div className="template-engine-container w-full h-full">
            <Layout data={data} theme={theme} />
        </div>
    );
};

export default TemplateFactory;
export { Layouts, Themes };
