<template>
    <MobileMenu :links="links" class="bk-col-root" v-if="!hideModal" />
    
    <slot />
    <WorkArchive class="mt-13 bk-col-max" />
    <!-- FOOTER -->
     <footer class="bk-col-full mt-14">
        <p class="text-accent text-sm font-medium">Before code, before solutions — I listen.</p>
        <h3 class="text-neutral-800 font-medium text-2xl leading-7 tracking-tighter mb-6">Identifying the Problem — <br> <span class="text-neutral-500">Honest communication and deep listening</span></h3>

        <strong class="font-epilogue text-5xl text-neutral-800 tracking--.6 leading-12">
            “The right solution begins with the right questions.”
        </strong>

        <div class="footer mt-20 space-y-2 mb-5" grid="~ justify-items-center">
            <div class="w-full max-w-125 border-3 b-accent b-b-0 h-3"></div>
            <div class="footer-divider"></div>
            <p class="text-sm font-medium text-center tracking-tight">No tech knowledge required <br> — I’ll walk you through everything you need.</p>
            <p class="font-epilogue text-neutral-800 text-2xl text-center font-medium tracking-tighter"> <a href="mailto:wills.yte50@gmail.com" text-2xl hover="text-accent">[Let’s Work Together]</a>  or <a href="https://api.whatsapp.com/send?phone=2349019381921" max-sm:block text-2xl hover="text-accent">[Book a Call]</a></p>
        </div>
     </footer>
</template>

<script lang="ts" setup>
const links = [
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
        path: "/#work-process",
    },
    {
        name: "Portfolio / Case Studies",
        path: "/work",
    },
];

const hideModal = ref(true);
const bus = useEventBus<string>("mobile-menu");
bus.on((event) => {
    if (event === "close") {
        hideModal.value = true;
    } else if (event === "open") {
        hideModal.value = false;
    }
})
</script>

<style>
.footer-divider {
    background:  linear-gradient(90deg, #FBFBFB 0% 0%, #E0E0E0 46.88% 46.88%, #FBFBFB 100% 100%);
    width: 100%;
    max-width: 128px;
    height: 2px;
}
</style>
