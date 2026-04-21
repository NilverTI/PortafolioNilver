const localizedText = (en, es) => ({ en, es });

export const UI_TRANSLATIONS = {
    en: {
        header: {
            logoAria: 'Go to home',
            navAria: 'Main navigation',
            menuAria: 'Open menu',
            languageSelector: 'Language selector',
            switchToEnglish: 'Switch to English',
            switchToSpanish: 'Switch to Spanish',
            nav: {
                home: 'Home',
                skills: 'Skills',
                projects: 'Projects',
                contact: 'Contact'
            }
        },
        home: {
            badge: 'Available for freelance projects',
            greeting: 'Hello, I am',
            description: 'I build modern, scalable, high-performance web applications with clean design and solid architecture.',
            viewProjects: 'View Projects',
            contactMe: 'Contact Me',
            imageAlt: 'Nilver T.I - Full Stack Developer',
            fallbackPhoto: 'Add your photo to<br /><code>img/ico/logo.png</code>',
            experienceLabel: 'Years of<br />experience',
            projectsDelivered: '+10 Projects delivered'
        },
        skillsSection: {
            label: 'What can I do?',
            titlePrefix: 'My',
            titleAccent: 'Skills',
            subtitle: 'Technologies I use to build modern, scalable, high-impact products.'
        },
        skillsView: {
            goToPage: 'Go to page {page}',
            pageInfo: 'Showing {start}-{end} of {total} skills'
        },
        projectsSection: {
            label: 'What I have built',
            titlePrefix: 'My',
            titleAccent: 'Projects',
            subtitle: 'Real websites, in production, built with modern technologies.',
            previousPage: 'Previous page',
            nextPage: 'Next page'
        },
        projectsView: {
            visitWebsite: 'Visit website',
            liveAria: 'View {title} live',
            goToPage: 'Go to page {page}'
        },
        contact: {
            label: 'Have a project?',
            titlePrefix: 'Contact ',
            titleAccent: 'Me',
            subtitle: 'Tell me about your idea and I will get back to you as soon as possible.',
            successTitle: 'Message sent successfully!',
            successText: 'Thanks for reaching out. I will reply as soon as possible.',
            errorTitle: 'There was a problem sending the message',
            errorText: 'Please try again later or check your connection.',
            formSubject: 'New message from the NILVER T.I portfolio',
            nameLabel: 'Name',
            namePlaceholder: 'Your name',
            emailLabel: 'Email',
            emailPlaceholder: 'you@email.com',
            subjectLabel: 'Subject',
            subjectPlaceholder: 'Message subject',
            messageLabel: 'Message',
            messagePlaceholder: 'How can I help you?',
            submit: 'Send message',
            sending: 'Sending...',
            submitErrorFallback: 'Error sending message',
            socialLabel: 'Find me on',
            socialTitle: 'My networks',
            socialSubtitle: 'Follow me on social media and stay up to date with my projects.'
        },
        footer: {
            accessGranted: 'ACCESS GRANTED ///'
        }
    },
    es: {
        header: {
            logoAria: 'Ir al inicio',
            navAria: 'Navegación principal',
            menuAria: 'Abrir menú',
            languageSelector: 'Selector de idioma',
            switchToEnglish: 'Cambiar a inglés',
            switchToSpanish: 'Cambiar a español',
            nav: {
                home: 'Inicio',
                skills: 'Habilidades',
                projects: 'Proyectos',
                contact: 'Contacto'
            }
        },
        home: {
            badge: 'Disponible para proyectos freelance',
            greeting: 'Hola, soy',
            description: 'Construyo aplicaciones web modernas, escalables y de alto rendimiento con diseño limpio y arquitectura sólida.',
            viewProjects: 'Ver Proyectos',
            contactMe: 'Contáctame',
            imageAlt: 'Nilver T.I - Desarrollador Full Stack',
            fallbackPhoto: 'Añade tu foto en<br /><code>img/ico/logo.png</code>',
            experienceLabel: 'Años de<br />experiencia',
            projectsDelivered: '+10 Proyectos entregados'
        },
        skillsSection: {
            label: '¿Qué sé hacer?',
            titlePrefix: 'Mis',
            titleAccent: 'Habilidades',
            subtitle: 'Tecnologías que uso para construir productos modernos, escalables y de alto impacto.'
        },
        skillsView: {
            goToPage: 'Ir a página {page}',
            pageInfo: 'Mostrando {start}-{end} de {total} habilidades'
        },
        projectsSection: {
            label: 'Lo que he construido',
            titlePrefix: 'Mis',
            titleAccent: 'Proyectos',
            subtitle: 'Sitios web reales, en producción, construidos con tecnologías modernas.',
            previousPage: 'Página anterior',
            nextPage: 'Página siguiente'
        },
        projectsView: {
            visitWebsite: 'Ver sitio web',
            liveAria: 'Ver {title} en vivo',
            goToPage: 'Ir a página {page}'
        },
        contact: {
            label: '¿Tienes un proyecto?',
            titlePrefix: 'Contáct',
            titleAccent: 'ame',
            subtitle: 'Cuéntame sobre tu idea y te respondo lo antes posible.',
            successTitle: '¡Mensaje enviado correctamente!',
            successText: 'Gracias por contactarme. Te responderé lo antes posible.',
            errorTitle: 'Hubo un problema al enviar el mensaje',
            errorText: 'Por favor intenta de nuevo más tarde o revisa tu conexión.',
            formSubject: 'Nuevo mensaje desde el portafolio de NILVER T.I',
            nameLabel: 'Nombre',
            namePlaceholder: 'Tu nombre',
            emailLabel: 'Correo electrónico',
            emailPlaceholder: 'tu@email.com',
            subjectLabel: 'Asunto',
            subjectPlaceholder: 'Asunto del mensaje',
            messageLabel: 'Mensaje',
            messagePlaceholder: '¿En qué puedo ayudarte?',
            submit: 'Enviar mensaje',
            sending: 'Enviando...',
            submitErrorFallback: 'Error al enviar el mensaje',
            socialLabel: 'Encuéntrame en',
            socialTitle: 'Mis redes',
            socialSubtitle: 'Sígueme en mis redes sociales y mantente al tanto de mis proyectos.'
        },
        footer: {
            accessGranted: 'ACCESO CONCEDIDO ///'
        }
    }
};

export const HOME_ROLES = {
    en: [
        'Full Stack Developer',
        'Frontend Developer',
        'Backend Developer',
        'React & Node.js Specialist'
    ],
    es: [
        'Desarrollador Full Stack',
        'Desarrollador Frontend',
        'Desarrollador Backend',
        'Especialista en React & Node.js'
    ]
};

export const NAV_LINKS = [
    { href: '#home', label: localizedText('Home', 'Inicio') },
    { href: '#skills', label: localizedText('Skills', 'Habilidades') },
    { href: '#projects', label: localizedText('Projects', 'Proyectos') },
    { href: '#contact', label: localizedText('Contact', 'Contacto') }
];

export const SKILLS = [
    {
        title: 'HTML5',
        description: localizedText('Semantic and accessible markup', 'Maquetacion semantica y accesible'),
        value: 90,
        icon: 'fa-brands fa-html5',
        color: '#E34F26'
    },
    {
        title: 'CSS3',
        description: localizedText('Advanced styling, animations and responsive design', 'Estilos avanzados, animaciones y responsive'),
        value: 85,
        icon: 'fa-brands fa-css3-alt',
        color: '#1572B6'
    },
    {
        title: 'JavaScript',
        description: localizedText('Client-side logic and asynchronous programming', 'Logica del cliente y programacion asincrona'),
        value: 80,
        icon: 'fa-brands fa-js',
        color: '#F7DF1E'
    },
    {
        title: 'TypeScript',
        description: localizedText('Typed JavaScript for robust code', 'JavaScript tipado para codigo robusto'),
        value: 70,
        icon: 'fa-solid fa-code',
        color: '#3178C6'
    },
    {
        title: 'React',
        description: localizedText('Modern interfaces with reusable components', 'Interfaces modernas con componentes reutilizables'),
        value: 75,
        icon: 'fa-brands fa-react',
        color: '#61DAFB'
    },
    {
        title: 'Next.js',
        description: localizedText('React framework for production', 'Framework de React para produccion'),
        value: 72,
        icon: 'fa-brands fa-n',
        color: '#ffffff'
    },
    {
        title: 'Node.js',
        description: localizedText('Backend APIs and servers with JavaScript', 'APIs y servidores backend con JavaScript'),
        value: 70,
        icon: 'fa-brands fa-node-js',
        color: '#339933'
    },
    {
        title: 'MongoDB',
        description: localizedText('Document-oriented NoSQL database', 'Base de datos NoSQL orientada a documentos'),
        value: 65,
        icon: 'fa-solid fa-database',
        color: '#47A248'
    },
    {
        title: 'Tailwind CSS',
        description: localizedText('Fast and consistent utility-first styling', 'Diseno utility-first rapido y consistente'),
        value: 85,
        icon: 'fa-brands fa-css3',
        color: '#38BDF8'
    },
    {
        title: 'Git & GitHub',
        description: localizedText('Version control and team collaboration', 'Control de versiones y colaboracion en equipo'),
        value: 80,
        icon: 'fa-brands fa-git-alt',
        color: '#F05032'
    },
    {
        title: 'UI/UX Design',
        description: localizedText('Clean interfaces and user experience', 'Interfaces limpias y experiencia de usuario'),
        value: 75,
        icon: 'fa-solid fa-pen-ruler',
        color: '#E50914'
    }
];

export const PROJECTS = [
    {
        id: 'peruserver',
        title: localizedText('Peruserver Website', 'Web de Peruserver'),
        description: localizedText('Official PERUSERVER driving simulator website inspired by Peru.', 'Sitio web oficial de PERUSERVER, simulador de conduccion inspirado en Peru.'),
        imageSrc: 'img/proyectos/peruserver.webp',
        imageAlt: localizedText('Peruserver website preview', 'Vista previa del sitio de Peruserver'),
        websiteUrl: 'https://peruserver.pe',
        codeUrl: 'https://github.com/NilverTI/peruserver.de'
    },
    {
        id: 'movilbuspsv',
        title: localizedText('MOVIL BUS PSV Website', 'Web de MOVIL BUS PSV'),
        description: localizedText('Official MOVIL BUS PSV website with Trucky API integration and a Supabase-powered photo gallery.', 'Sitio web oficial de MOVIL BUS PSV con consumo de la API de Trucky y conexion con Supabase para una galeria de fotos.'),
        imageSrc: 'img/proyectos/movilbuspsv.webp',
        imageAlt: localizedText('MOVIL BUS PSV website preview', 'Vista previa del sitio de MOVIL BUS PSV'),
        websiteUrl: 'https://www.movilbuspsv.de/',
        codeUrl: 'https://github.com/NilverTI/movilbus'
    },
    {
        id: 'transzelapsv',
        title: localizedText('TRANSZELA PSV Website', 'Web de TRANSZELA PSV'),
        description: localizedText('Official TRANSZELA PSV website with Trucky API integration and a Supabase-powered photo gallery.', 'Sitio web oficial de TRANSZELA PSV con consumo de la API de Trucky y conexion con Supabase para una galeria de fotos.'),
        imageSrc: 'img/proyectos/transzelapsv.webp',
        imageAlt: localizedText('TRANSZELA PSV website preview', 'Vista previa del sitio de TRANSZELA PSV'),
        websiteUrl: 'https://transzelapsv.ink/',
        codeUrl: 'https://github.com/NilverTI/transzelapsv'
    },
    {
        id: 'rarazpsv',
        title: localizedText('RARAZ PSV Website', 'Web de RARAZ PSV'),
        description: localizedText('Official RARAZ PSV website with Trucky API integration and a Supabase-powered photo gallery.', 'Sitio web oficial de RARAZ PSV con consumo de la API de Trucky y conexion con Supabase para una galeria de fotos.'),
        imageSrc: 'img/proyectos/rarazpsv.webp',
        imageAlt: localizedText('RARAZ PSV website preview', 'Vista previa del sitio de RARAZ PSV'),
        websiteUrl: 'https://raraz.peruserver.pe/',
        codeUrl: 'https://github.com/NilverTI/rarazpsv'
    },
    {
        id: 'cicsa',
        title: localizedText('Cicsa Website', 'Web de Cicsa'),
        description: localizedText('Official CICSA Medical Center website, specialized in medical exams for driver licenses.', 'Sitio web oficial del Centro Medico CICSA, especializado en examenes medicos para licencias de conducir.'),
        imageSrc: 'img/proyectos/cicsa.jpg',
        imageAlt: localizedText('Cicsa website preview', 'Vista previa del sitio de Cicsa'),
        websiteUrl: 'https://cicsa.netlify.app/',
        codeUrl: 'https://github.com/NilverTI/CICSA'
    },
    {
        id: 'social-media-manager',
        title: localizedText('Social Media Manager', 'Gestor de Redes Sociales'),
        description: localizedText('Interactive web app to manage multiple social media accounts from a single dashboard. Ideal for creators and small businesses.', 'Web interactiva para administrar multiples redes sociales desde un solo panel. Ideal para creadores de contenido y pymes.'),
        imageSrc: 'img/proyectos/redes.jpg',
        imageAlt: localizedText('Social Media Manager preview', 'Vista previa del gestor de redes sociales'),
        websiteUrl: 'https://nilverti.netlify.app/',
        codeUrl: 'https://github.com/NilverTI/Redes-Sociales'
    },
    {
        id: 'virtual-flowers',
        title: localizedText('Virtual Flowers', 'Flores Virtuales'),
        description: localizedText('Website to send animated flowers with effects and custom messages for friends, partners or loved ones.', 'Web para enviar flores animadas con efectos y mensajes personalizados para amigas, novias o seres queridos.'),
        imageSrc: 'img/proyectos/flores.jpg',
        imageAlt: localizedText('Virtual Flowers preview', 'Vista previa de Flores Virtuales'),
        websiteUrl: 'https://web-flores.netlify.app/',
        codeUrl: 'https://github.com/NilverTI/Web-Flores'
    },
    {
        id: 'christmas-tree',
        title: localizedText('Christmas Tree', 'Arbol de Navidad'),
        description: localizedText('Interactive Christmas project with animated lights, personalized messages and a warm atmosphere to share during the holidays.', 'Proyecto interactivo navideno con luces animadas, mensajes personalizados y una ambientacion calida para compartir en fiestas.'),
        imageSrc: 'img/proyectos/arbol.jpg',
        imageAlt: localizedText('Christmas Tree preview', 'Vista previa de Arbol de Navidad'),
        websiteUrl: 'https://web-arbol-navidad.netlify.app/',
        codeUrl: 'https://github.com/NilverTI/Web-Arbol-Navidad',
        actionLinkClassName: 'flex-1 bg-gray-800 text-white text-center py-2 rounded-md hover:bg-gray-700 transition'
    },
    {
        id: 'heart-animation',
        title: localizedText('Heart Animation', 'Animacion de corazon'),
        description: localizedText('Beautiful heart animation created with HTML5 and JavaScript that simulates a pulse with a dynamic visual effect.', 'Hermosa animacion de un corazon creada con HTML5 y JavaScript que simula un pulso con una dinamica visual.'),
        imageSrc: 'img/proyectos/corazon.jpg',
        imageAlt: localizedText('Heart Animation preview', 'Vista previa de Animacion de corazon'),
        websiteUrl: 'https://corazonanimado.netlify.app/',
        codeUrl: 'https://github.com/NilverTI/Web-Animacion-Corazon'
    }
];

export const SOCIAL_LINKS = [
    {
        href: 'https://www.instagram.com/nilvert.i/',
        title: 'Instagram',
        iconClassName: 'fab fa-instagram',
        hoverClassName: 'hover:text-pink-500'
    },
    {
        href: 'https://github.com/NilverTI',
        title: 'GitHub',
        iconClassName: 'fab fa-github',
        hoverClassName: 'hover:text-white'
    },
    {
        href: 'https://www.linkedin.com/in/nilverti/',
        title: 'LinkedIn',
        iconClassName: 'fab fa-linkedin',
        hoverClassName: 'hover:text-blue-500'
    },
    {
        href: 'https://tiktok.com/@nilvert.i',
        title: 'TikTok',
        iconClassName: 'fab fa-tiktok',
        hoverClassName: 'hover:text-pink-400'
    },
    {
        href: 'https://www.youtube.com/@nilvert.i',
        title: 'YouTube',
        iconClassName: 'fab fa-youtube',
        hoverClassName: 'hover:text-red-600'
    }
];

export const SKILL_VIEW_LABELS = {
    circular: localizedText('Switch to bars view', 'Cambiar a vista de barras'),
    bars: localizedText('Switch to circular view', 'Cambiar a vista circular')
};

export const SKILL_CATEGORIES = [
    {
        label: localizedText('Frontend', 'Frontend'),
        title: localizedText('The visual layer, navigation and the direct user experience', 'Lo visual, la navegacion y la experiencia directa del usuario'),
        description: localizedText('Technologies that build the interface, the visual style and the interaction of a modern website or interface.', 'Tecnologias que construyen la interfaz, el estilo visual y la interaccion de una web o una interfaz moderna.'),
        color: '#E50914',
        skills: [
            { name: 'HTML5', desc: localizedText('Page structure', 'Estructura de paginas'), icon: 'fa-brands fa-html5', color: '#E34F26', value: 95 },
            { name: 'CSS3', desc: localizedText('Styling and layout', 'Estilo y layout'), icon: 'fa-brands fa-css3-alt', color: '#1572B6', value: 90 },
            { name: 'JavaScript', desc: localizedText('Dynamic interaction', 'Interaccion dinamica'), icon: 'fa-brands fa-js', color: '#F7DF1E', value: 85 },
            { name: 'TypeScript', desc: localizedText('Typed and robust JS', 'JS tipado y robusto'), icon: 'fa-solid fa-code', color: '#3178C6', value: 76 },
            { name: 'React', desc: localizedText('Component-based interfaces', 'Interfaces por componentes'), icon: 'fa-brands fa-react', color: '#61DAFB', value: 80 },
            { name: 'Next.js', desc: localizedText('Framework for React', 'Framework para React'), icon: 'fa-brands fa-n', color: '#ffffff', value: 72 },
            { name: 'jQuery', desc: localizedText('Fast DOM manipulation', 'Manipulacion rapida del DOM'), icon: 'fa-solid fa-bolt', color: '#0769AD', value: 75 },
            { name: 'Qt', desc: localizedText('Cross-platform interfaces', 'Interfaces multiplataforma'), icon: 'fa-solid fa-desktop', color: '#41CD52', value: 70 }
        ]
    },
    {
        label: localizedText('Backend and Development', 'Backend y Desarrollo'),
        title: localizedText('Logic, technical foundations and deeper programming work', 'La logica, la base tecnica y el trabajo de programacion mas profunda'),
        description: localizedText('Languages and frameworks that support the functional side of the project, automation and the development of stronger solutions.', 'Lenguajes y frameworks que sostienen la parte funcional del proyecto, la automatizacion y el desarrollo de soluciones mas robustas.'),
        color: '#3178C6',
        skills: [
            { name: 'Node.js', desc: localizedText('Server-side logic', 'Logica del servidor'), icon: 'fa-brands fa-node-js', color: '#339933', value: 85 },
            { name: 'PHP', desc: localizedText('Classic web backend', 'Backend web clasico'), icon: 'fa-brands fa-php', color: '#777BB4', value: 75 },
            { name: 'Python', desc: localizedText('Automation and development', 'Automatizacion y desarrollo'), icon: 'fa-brands fa-python', color: '#3776AB', value: 80 },
            { name: 'Django', desc: localizedText('Backend framework', 'Framework backend'), icon: 'fa-brands fa-python', color: '#092E20', value: 72 },
            { name: 'Java', desc: localizedText('Robust applications', 'Aplicaciones robustas'), icon: 'fa-brands fa-java', color: '#ED8B00', value: 70 },
            { name: 'Kotlin', desc: localizedText('Modern development', 'Desarrollo moderno'), icon: 'fa-solid fa-k', color: '#7F52FF', value: 70 },
            { name: 'C++', desc: localizedText('Performance and technical foundations', 'Rendimiento y base tecnica'), icon: 'fa-solid fa-c', color: '#00599C', value: 73 }
        ]
    },
    {
        label: localizedText('Tools / DevOps', 'Tools / DevOps'),
        title: localizedText('Publishing, workflow and professional project control', 'Publicacion, flujo de trabajo y control profesional del proyecto'),
        description: localizedText('Tools to version, deploy, automate processes and maintain a more organized workflow throughout the development cycle.', 'Herramientas para versionar, desplegar, automatizar procesos y mantener un trabajo mas ordenado durante todo el ciclo de desarrollo.'),
        color: '#F05032',
        skills: [
            { name: 'Git', desc: localizedText('Version control', 'Control de versiones'), icon: 'fa-brands fa-git-alt', color: '#F05032', value: 90 },
            { name: 'GitHub', desc: localizedText('Repositories and collaboration', 'Repositorios y colaboracion'), icon: 'fa-brands fa-github', color: '#ffffff', value: 88 },
            { name: 'GitLab', desc: localizedText('Technical management', 'Gestion tecnica'), icon: 'fa-brands fa-gitlab', color: '#FC6D26', value: 78 },
            { name: 'GitHub Actions', desc: localizedText('CI/CD automation', 'Automatizacion CI/CD'), icon: 'fa-solid fa-gears', color: '#2088FF', value: 75 },
            { name: 'Netlify', desc: localizedText('Web deployment', 'Despliegue web'), icon: 'fa-solid fa-cloud-arrow-up', color: '#00C7B7', value: 85 },
            { name: 'Apache', desc: localizedText('Web server', 'Servidor web'), icon: 'fa-solid fa-server', color: '#D22128', value: 72 }
        ]
    },
    {
        label: localizedText('Design', 'Diseno'),
        title: localizedText('Prototyping, visual composition and interface criteria', 'Prototipado, composicion visual y criterio de interfaz'),
        description: localizedText('Resources and capabilities focused on visual presentation, composition and experience clarity for more polished products.', 'Recursos y capacidades orientadas a presentacion visual, composicion de piezas y claridad de experiencia para productos mas pulidos.'),
        color: '#A855F7',
        skills: [
            { name: 'Figma', desc: localizedText('Prototypes and interfaces', 'Prototipos e interfaces'), icon: 'fa-brands fa-figma', color: '#F24E1E', value: 85 },
            { name: 'Canva', desc: localizedText('Fast visual assets', 'Piezas visuales rapidas'), icon: 'fa-solid fa-palette', color: '#00C4CC', value: 80 },
            { name: 'UI/UX Design', desc: localizedText('Hierarchy and visual clarity', 'Jerarquia y claridad visual'), icon: 'fa-solid fa-pen-ruler', color: '#E50914', value: 78 }
        ]
    }
];
