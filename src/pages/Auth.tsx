import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoginForm } from "@/components/auth/LoginForm";
import { SignupForm } from "@/components/auth/SignupForm";

export default function Auth() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/50 to-background p-4">
            {/* Background decoration */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute -top-[40%] -left-[20%] w-[70%] h-[70%] rounded-full bg-primary/20 blur-[100px]" />
                <div className="absolute top-[40%] -right-[20%] w-[70%] h-[70%] rounded-full bg-primary/20 blur-[100px]" />
            </div>

            <div className="w-full max-w-md space-y-8">
                <div className="flex flex-col items-center space-y-2 text-center">
                    <div className="flex items-center justify-center p-3 rounded-xl bg-primary/10 ring-1 ring-primary/20">
                        <img
                            src="/Explainify.png"
                            alt="Explainify Logo"
                            className="h-8 w-8 object-contain"
                        />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tighter">Welcome back</h1>
                    <p className="text-muted-foreground">
                        Sign in to your account to continue
                    </p>
                </div>

                <Card className="border-0 shadow-lg bg-background/60 backdrop-blur-xl ring-1 ring-white/10 dark:ring-white/5">
                    <CardHeader className="pb-0">
                        {/* Header content moved outside or kept minimal here */}
                    </CardHeader>
                    <CardContent className="pt-6">
                        <Tabs defaultValue="login" className="w-full">
                            <TabsList className="grid w-full grid-cols-2 mb-6">
                                <TabsTrigger value="login">Login</TabsTrigger>
                                <TabsTrigger value="signup">Sign Up</TabsTrigger>
                            </TabsList>
                            <TabsContent value="login">
                                <LoginForm />
                            </TabsContent>
                            <TabsContent value="signup">
                                <SignupForm />
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
