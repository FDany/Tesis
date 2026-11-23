import { Form, Head } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { home } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';

type Props = {
    status?: string;
    canResetPassword: boolean;
};

export default function Login({ status, canResetPassword }: Props) {
    return (
        <>
            <Head title="Iniciar sesión" />

            {status && (
                <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-3 text-center text-sm font-medium text-green-700 dark:border-green-900/50 dark:bg-green-950/50 dark:text-green-400">
                    {status}
                </div>
            )}

            <Form
                {...store.form()}
                resetOnSuccess={['password']}
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-5">
                            <div className="grid gap-2">
                                <Label htmlFor="dni">DNI</Label>
                                <Input
                                    id="dni"
                                    type="text"
                                    inputMode="numeric"
                                    name="dni"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="username"
                                    placeholder="Ingresa tu número de DNI"
                                />
                                <InputError message={errors.dni} />
                            </div>

                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Contraseña</Label>
                                    {canResetPassword && (
                                        <TextLink
                                            href={request()}
                                            className="ml-auto text-xs text-neutral-600 hover:text-[#296b8b] dark:text-neutral-400"
                                            tabIndex={5}
                                        >
                                            ¿Olvidaste tu contraseña?
                                        </TextLink>
                                    )}
                                </div>
                                <PasswordInput
                                    id="password"
                                    name="password"
                                    required
                                    tabIndex={2}
                                    autoComplete="current-password"
                                    placeholder="••••••••"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="flex items-center space-x-2.5">
                                <Checkbox
                                    id="remember"
                                    name="remember"
                                    tabIndex={3}
                                />
                                <Label
                                    htmlFor="remember"
                                    className="cursor-pointer text-sm font-normal text-neutral-600 dark:text-neutral-400"
                                >
                                    Mantener sesión iniciada
                                </Label>
                            </div>

                            <Button
                                type="submit"
                                className="mt-2 w-full bg-[#296b8b] text-white hover:bg-[#215772] dark:bg-[#296b8b] dark:text-white dark:hover:bg-[#327da1]"
                                tabIndex={4}
                                disabled={processing}
                                data-test="login-button"
                            >
                                {processing && <Spinner className="mr-2" />}
                                Ingresar al sistema
                            </Button>
                        </div>

                        <div className="border-t border-neutral-100 pt-4 text-center dark:border-neutral-800">
                            <TextLink
                                href={home()}
                                className="inline-flex items-center gap-1.5 text-xs text-neutral-500 no-underline hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
                                tabIndex={6}
                            >
                                <ArrowLeft className="h-3.5 w-3.5" />
                                Volver al inicio
                            </TextLink>
                        </div>
                    </>
                )}
            </Form>
        </>
    );
}

Login.layout = {
    title: 'EcoGestión',
    description: 'Ingresa tu DNI y contraseña para acceder al sistema.',
};
