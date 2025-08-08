
"use client";

import React from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { X } from 'lucide-react';
import { useUserData } from '@/hooks/use-user-data';

interface ActivationDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function ActivationDialog({ open, onOpenChange }: ActivationDialogProps) {
    const { user } = useAuth();
    const { userData } = useUserData();

    const handleSendEmail = () => {
        const name = userData?.displayName || 'N/A';
        const email = user?.email || 'N/A';
        const uid = user?.uid || 'N/A';

        const subject = encodeURIComponent("To Activate My Account");
        const body = encodeURIComponent(
`Hey Tryquad AI Team,

Please Activate My Account. Here are My Account Details:
Name: ${name}
Email: ${email}
UID: ${uid}

Thanks For This Help.`
        );
        window.location.href = `mailto:helpdesk.grock@outlook.com?subject=${subject}&body=${body}`;
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-center">Your account Takes 10-20 Mins To Take actions</DialogTitle>
                    <DialogDescription className="text-center pt-2">
                        To active Your Account Fast Contect Our Team At <a href="mailto:helpdesk.grock@outlook.com" className="text-primary hover:underline">helpdesk.grock@outlook.com</a>
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="sm:justify-center gap-2 pt-4">
                    <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
                        Ok, Got It
                    </Button>
                    <Button type="button" onClick={handleSendEmail}>
                        Send Mail
                    </Button>
                </DialogFooter>
                 <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                </DialogClose>
            </DialogContent>
        </Dialog>
    );
}
