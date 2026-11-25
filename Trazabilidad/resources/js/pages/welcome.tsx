import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowRight, Barcode, FileCheck2, Scale } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Welcome() {
    const { auth } = usePage<{ auth: { user: unknown } }>().props;

    return (
        <>
            <Head title="Hospital San Bernardo" />

            <div className="flex min-h-screen flex-col justify-between bg-muted text-foreground dark:bg-background">
                {/* Barra superior */}
                <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
                    <div className="flex items-center gap-3">
                        <img
                            src="/images/logo-hsb-icono.png"
                            alt="Logo HSB"
                            className="h-9 w-auto object-contain"
                        />
                        <div className="h-6 w-px bg-border" />
                        <div>
                            <span className="block text-sm font-semibold leading-none tracking-tight">
                                EcoGestión
                            </span>
                            <span className="mt-1 block text-xs text-muted-foreground">
                                Trazabilidad de Residuos
                            </span>
                        </div>
                    </div>

                    <nav>
                        {auth?.user ? (
                            <Button asChild variant="default">
                                <Link href="/dashboard">
                                    Ir al Panel
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        ) : (
                            <Button asChild variant="outline">
                                <Link href="/login">Iniciar sesión</Link>
                            </Button>
                        )}
                    </nav>
                </header>

                {/* Tarjeta central */}
                <main className="mx-auto flex w-full max-w-5xl flex-1 items-center px-6 py-6">
                    <div className="grid w-full overflow-hidden rounded-2xl border border-border bg-card shadow-sm lg:grid-cols-12">
                        {/* Columna Izquierda: Presentación y Acción */}
                        <div className="flex flex-col justify-center p-8 sm:p-12 lg:col-span-7">
                            <div className="mb-4 inline-flex w-fit items-center rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                                Gestión Ambiental Hospitalaria
                            </div>

                            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                                Control integral de residuos peligrosos
                            </h1>

                            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                                Sistema interno del Hospital San Bernardo para la trazabilidad por código de barras, pesaje, distribución por servicios y conciliación de manifiestos de disposición final.
                            </p>

                            <div className="mt-8 flex flex-wrap items-center gap-4">
                                <Button
                                    asChild
                                    size="lg"
                                    className="bg-[#296b8b] px-6 text-white hover:bg-[#23516a] dark:bg-[#2c6482] dark:text-white dark:hover:bg-[#357699]"
                                >
                                    <Link href={auth?.user ? '/dashboard' : '/login'}>
                                        {auth?.user ? 'Ingresar al Panel' : 'Acceder al Sistema'}
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                            </div>
                        </div>

                        {/* Columna Derecha: Identidad Institucional y Circuito */}
                        <div className="flex flex-col justify-between bg-[#296b8b] p-8 text-white sm:p-10 lg:col-span-5">
                            <div>
                                {/* Logo Horizontal del Hospital */}
                                <div className="mb-8 border-b border-white/15 pb-6">
                                    <img
                                        src="/images/logo-hsb-horizontal.png"
                                        alt="Hospital San Bernardo"
                                        className="h-12 w-auto object-contain"

                                    />
                                </div>

                                <p className="text-xs font-semibold uppercase tracking-wider text-white/70">
                                    Circuito operativo
                                </p>

                                <div className="mt-5 space-y-5">
                                    <div className="flex items-start gap-3.5">
                                        <div className="mt-0.5 rounded-md bg-white/10 p-2 text-white">
                                            <Barcode className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-medium text-white">
                                                Recepción e Identificación
                                            </h3>
                                            <p className="mt-0.5 text-xs leading-relaxed text-white/80">
                                                Alta de remitos DGM y lectura de lotes de bolsas rojas y amarillas.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3.5">
                                        <div className="mt-0.5 rounded-md bg-white/10 p-2 text-white">
                                            <Scale className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-medium text-white">
                                                Pesaje y Control Interno
                                            </h3>
                                            <p className="mt-0.5 text-xs leading-relaxed text-white/80">
                                                Entrega a servicios internos, pesaje en depósito y registro de incidencias.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3.5">
                                        <div className="mt-0.5 rounded-md bg-white/10 p-2 text-white">
                                            <FileCheck2 className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-medium text-white">
                                                Manifiestos y Conciliación
                                            </h3>
                                            <p className="mt-0.5 text-xs leading-relaxed text-white/80">
                                                Generación de remitos de salida y control de pesaje declarado vs. sistema.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 border-t border-white/15 pt-4 text-xs text-white/75">
                                Uso exclusivo para personal autorizado.
                            </div>
                        </div>
                    </div>
                </main>

                {/* Pie de página */}
                <footer className="py-6 text-center text-xs text-muted-foreground">
                    Hospital San Bernardo • Salta, Argentina — EcoGestión
                </footer>
            </div>
        </>
    );
}
