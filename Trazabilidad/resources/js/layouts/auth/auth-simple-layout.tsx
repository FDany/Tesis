import { Link } from '@inertiajs/react';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 text-foreground dark:bg-background md:p-10">
            <div className="w-full max-w-md overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
                {/* Franja institucional superior */}
                <div className="h-2 w-full bg-[#296b8b]" />

                <div className="flex flex-col gap-6 p-8">
                    <div className="flex flex-col items-center gap-4">
                        <Link
                            href={home()}
                            className="flex flex-col items-center gap-2 font-medium"
                        >
                            <img
                                src="/images/logo-hsb-vertical.png"
                                alt="Hospital San Bernardo"
                                className="h-20 w-auto object-contain dark:brightness-0 dark:invert"
                            />
                            <span className="sr-only">{title}</span>
                        </Link>

                        <div className="space-y-1 text-center">
                            <h1 className="text-xl font-bold tracking-tight">
                                {title}
                            </h1>
                            <p className="text-center text-sm text-muted-foreground">
                                {description}
                            </p>
                        </div>
                    </div>

                    {children}
                </div>
            </div>

            <p className="mt-6 text-center text-xs text-muted-foreground">
                Hospital San Bernardo • Salta, Argentina — EcoGestión
            </p>
        </div>
    );
}
