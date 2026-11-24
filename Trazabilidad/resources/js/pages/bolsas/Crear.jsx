import { Head, useForm } from '@inertiajs/react';

export default function CrearBolsa() {
    const { data, setData } = useForm({
        codigo_barras: '',
        peso: '',
        tipo_residuo: 'Patológico',
    });

    function mockSubmit(event) {
        event.preventDefault();
        alert(
            `¡Vista previa exitosa!\nCódigo: ${data.codigo_barras}\nPeso: ${data.peso} kg\nTipo: ${data.tipo_residuo}`,
        );
    }

    return (
        <>
            <div className="space-y-6 p-4 sm:mx-auto sm:w-full sm:max-w-3xl">
                <Head title="Nueva carga" />

                <div className="space-y-6 p-4">
                    <header>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Panel de Control - Trazabilidad
                        </h1>
                    </header>

                    <div className="max-w-3xl space-y-6">
                        <section className="overflow-hidden rounded-lg border bg-card shadow-sm">
                            <div className="p-6">
                                <h2 className="mb-6 border-b pb-2 text-lg font-medium">
                                    Registro Rápido de Bolsa
                                </h2>

                                <form
                                    onSubmit={mockSubmit}
                                    className="max-w-lg space-y-5"
                                >
                                    <div>
                                        <label
                                            htmlFor="codigo_barras"
                                            className="block text-sm font-medium"
                                        >
                                            Código de Barras (Escáner)
                                        </label>
                                        <input
                                            id="codigo_barras"
                                            type="text"
                                            value={data.codigo_barras}
                                            onChange={(event) =>
                                                setData(
                                                    'codigo_barras',
                                                    event.target.value,
                                                )
                                            }
                                            className="mt-1 block w-full rounded-md border bg-background px-3 py-2"
                                            placeholder="Escanee la etiqueta..."
                                            autoFocus
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="peso"
                                            className="block text-sm font-medium"
                                        >
                                            Peso registrado en balanza (kg)
                                        </label>
                                        <input
                                            id="peso"
                                            type="number"
                                            step="0.01"
                                            value={data.peso}
                                            onChange={(event) =>
                                                setData('peso', event.target.value)
                                            }
                                            className="mt-1 block w-full rounded-md border bg-background px-3 py-2"
                                            placeholder="0.00"
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="tipo_residuo"
                                            className="block text-sm font-medium"
                                        >
                                            Clasificación del Residuo
                                        </label>
                                        <select
                                            id="tipo_residuo"
                                            value={data.tipo_residuo}
                                            onChange={(event) =>
                                                setData(
                                                    'tipo_residuo',
                                                    event.target.value,
                                                )
                                            }
                                            className="mt-1 block w-full rounded-md border bg-background px-3 py-2"
                                        >
                                            <option value="Patológico">
                                                Bolsa Roja - Patológico
                                            </option>
                                            <option value="Infeccioso">
                                                Bolsa Amarilla - Infeccioso
                                            </option>
                                            <option value="Común">
                                                Bolsa Negra - Común
                                            </option>
                                        </select>
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full rounded-md bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90"
                                    >
                                        Registrar e Imprimir Comprobante
                                    </button>
                                </form>
                            </div>
                        </section>

                        <section className="rounded-lg border p-6 text-sm text-muted-foreground">
                            Aquí podrán ir los indicadores diarios (ej.: total de
                            kg recolectados hoy).
                        </section>
                    </div>
                </div>
            </div>
        </>
    );
}