import { useState } from 'react';  
import { Head, usePage } from '@inertiajs/react';  
  
import Heading from '@/components/heading';  
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';  
import PesajeForm from '@/features/deposito/components/PesajeForm';  
import RecepcionForm from '@/features/deposito/components/RecepcionForm';  
  
type Modo = 'recepcion' | 'pesaje';  
  
export default function CreateDeposito() {  
    const { puedeRecepcionar, puedePesar } = usePage<{  
        puedeRecepcionar: boolean;  
        puedePesar: boolean;  
    }>().props;  
  
    const [modo, setModo] = useState<Modo>(  
        puedeRecepcionar ? 'recepcion' : 'pesaje',  
    );  
  
    return (  
        <>  
            <Head title="Depósito" />  
  
            <div className="mx-auto max-w-3xl space-y-6 p-6">  
                <Heading  
                    title="Depósito"  
                    description="Recepción y pesaje de bolsas."  
                />  
  
                <Tabs  
                    value={modo}  
                    onValueChange={(valor) => setModo(valor as Modo)}  
                >  
                    <TabsList>  
                        {puedeRecepcionar && (  
                            <TabsTrigger value="recepcion">  
                                Recepción  
                            </TabsTrigger>  
                        )}  
                        {puedePesar && (  
                            <TabsTrigger value="pesaje">Pesaje</TabsTrigger>  
                        )}  
                    </TabsList>  
                </Tabs>  
  
                {modo === 'recepcion' && puedeRecepcionar && <RecepcionForm />}  
                {modo === 'pesaje' && puedePesar && <PesajeForm />}  
            </div>  
        </>  
    );  
}  