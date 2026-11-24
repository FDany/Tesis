import React from 'react';
import { AlertTriangle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

type ConfirmDeleteDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description: string;
    confirmLabel?: string;
    processingLabel?: string;
    onConfirm: () => void;
    processing?: boolean;
    confirmDisabled?: boolean;
    children?: React.ReactNode;
};

export function ConfirmDeleteDialog({
    open,
    onOpenChange,
    title,
    description,
    confirmLabel = 'Sí, eliminar',
    processingLabel = 'Procesando...',
    onConfirm,
    processing = false,
    confirmDisabled = false,
    children,
}: ConfirmDeleteDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
                            <AlertTriangle className="size-5" />
                        </div>
                        <DialogTitle className="text-lg font-bold">
                            {title}
                        </DialogTitle>
                    </div>
                    <DialogDescription className="pt-2 text-sm text-muted-foreground">
                        {description}
                    </DialogDescription>
                </DialogHeader>

                {children && <div className="pt-2">{children}</div>}

                <DialogFooter className="mt-4 flex justify-end gap-2 sm:justify-end">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={processing}
                    >
                        Volver
                    </Button>
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={onConfirm}
                        disabled={processing || confirmDisabled}
                    >
                        {processing ? processingLabel : confirmLabel}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
