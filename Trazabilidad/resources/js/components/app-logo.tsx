import { usePage } from '@inertiajs/react';

export default function AppLogo() {
    return (
        <>
            <div className="flex shrink-0 items-center justify-center">
                <img
                    src="/images/logo-hsb-icono.png"
                    alt="HSB"
                    className="h-9 w-auto object-contain group-data-[collapsible=icon]:h-6"
                />
            </div>
            <div className="ml-2 grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                <span className="truncate font-semibold tracking-tight">
                    EcoGestión
                </span>
                <span className="truncate text-xs text-muted-foreground">
                    Hospital San Bernardo
                </span>
            </div>
        </>
    );
}
