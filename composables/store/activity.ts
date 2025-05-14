export {
    useMobileMenu,
    useWorkArchive
}

const useMobileMenu = defineStore('mobile-menu', () => {
    const status = ref<"hide" | "show">('hide');
    const toggle = (state: "close" | "open") =>
        status.value = state === 'close' ? 'hide' : 'show';

    const links = ref([
        {
            name: "Home",
            path: "/",
        },
        {
            name: "About",
            path: "/about",
        },
        {
            name: "Services",
            path: "/services",
        },
        {
            name: "Work Process",
            path: "/myprocess",
        },
        {
            name: "Portfolio / Case Studies",
            path: "/work",
        },
    ])

    const bus = useEventBus<string>("mobile-menu");
    bus.on((event: any) => toggle(event));

    return {
        status,
        toggle,
        links
    }
})

const useWorkArchive = defineStore('work-archive', () => {
    const archive = ref<Record<any,any>[]>([]);
    const setArchive = (data: Record<any, any>[]) => {
        archive.value = data;
    }

    return {
        archive,
        setArchive
    }
})