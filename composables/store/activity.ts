export {
    useMobileMenu,
    useWorkArchive
}

const useMobileMenu = defineStore('mobile-menu', () => {
    var gsap: GSAP;
    const key = elementKey("mobile-menu")

    const status = ref<"hide" | "show">('hide');
    const toggle = (state: "close" | "open") => {
        if (state == 'close') {
            status.value = 'hide'
        }

        if (state == 'open') {
            status.value = 'show'
        }
    }

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
    bus.on(async (event: any) => {
        if (event == "close") {
            const body = document.querySelector("body") as HTMLBodyElement;

            if(!gsap) {
                gsap = (await import('gsap')).gsap
            }

            gsap.to(key, {
                height: 0,
                marginTop: '-1.25rem',
                duration: 0.5,
                ease: "sine.in",
                onComplete: () => {
                    body.classList.remove("overflow-hidden");
                    toggle("close");
                },
            });
        }

        if(event == "open") toggle('open')
    });

    return {
        status,
        toggle: (state: 'close' | 'open') => bus.emit(state),
        links
    }
})

const useWorkArchive = defineStore('work-archive', () => {
    const archive = ref<Record<any, any>[]>([]);
    const setArchive = (data: Record<any, any>[]) => {
        archive.value = data;
    }

    return {
        archive,
        setArchive
    }
})