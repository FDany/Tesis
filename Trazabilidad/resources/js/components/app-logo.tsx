import { usePage } from '@inertiajs/react';

import AppLogoIcon from '@/components/app-logo-icon';

export default function AppLogo() {
    const { name } = usePage().props;

    return (
        <>
            {/* <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground"> */}
                {/* <AppLogoIcon className="size-5 fill-current text-white dark:text-black" /> */}
                
            <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-linear-to-br from-cyan-100 via-cyan-200 to-sky-300 text-white">
                <AppLogoIcon className="size-5 text-green-400" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-semibold">
                    {name}
                </span>
            </div>
        </>
    );
}
