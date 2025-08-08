// src/components/activation-dialog.tsx
"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { useAuth } from '@/hooks/use-auth';
import { Mail } from 'lucide-react';

interface ActivationDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function ActivationDialog({ open, onOpenChange }: ActivationDialogProps) {
    const { user } = useAuth();

    const handleSendMail = () => {
        if (!user) return;

        const subject = "To Activate My Account";
        const body = `Hey Tryquad Ai Team,

Pls Activate My Account & Here is My Account Details 
Name:- ${user.displayName || 'N/A'}
Email:- ${user.email || 'N/A'}
Uid :- ${user.uid}

Thanks For This Help.`;

        const mailtoLink = `mailto:helpdesk.grock@outlook.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        
        window.location.href = mailtoLink;
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-center">
                        Your account Takes 10-20 Mins To Take actions
                    </DialogTitle>
                    <DialogDescription className="text-center pt-2">
                        To active Your Account Fast Contect Our Team At helpdesk.grock@outlook.com
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="sm:justify-center gap-2">
                    <Button onClick={handleSendMail}>
                        <Mail className="mr-2 h-4 w-4" />
                        Send Mail
                    </Button>
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">
                            Ok, Got It
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
