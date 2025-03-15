import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Form schema
const formSchema = z.object({
  monthlyIncome: z.string().transform(val => parseFloat(val)),
  riskTolerance: z.enum(['low', 'medium', 'high'])
});

type FormValues = z.infer<typeof formSchema>;

export default function Profile() {
  const { toast } = useToast();
  const userId = 1; // For demonstration, hardcode the user ID
  
  // Fetch user data
  const { data: user, isLoading } = useQuery({
    queryKey: ['/api/users', userId],
    queryFn: async () => {
      const response = await fetch(`/api/users/${userId}`);
      if (!response.ok) throw new Error('Failed to load user profile');
      return response.json();
    }
  });

  // Define the mutation
  const { mutate, isPending } = useMutation({
    mutationFn: async (data: FormValues) => {
      return apiRequest('PATCH', `/api/users/${userId}/profile`, data);
    },
    onSuccess: () => {
      toast({
        title: 'Profile updated',
        description: 'Your financial profile has been updated successfully.',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/users', userId] });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'There was a problem updating your profile.',
        variant: 'destructive',
      });
      console.error('Update error:', error);
    },
  });

  // Create form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      monthlyIncome: user?.monthlyIncome?.toString() || '',
      riskTolerance: user?.riskTolerance || 'medium',
    },
    values: {
      monthlyIncome: user?.monthlyIncome?.toString() || '',
      riskTolerance: user?.riskTolerance || 'medium',
    }
  });

  function onSubmit(data: FormValues) {
    mutate(data);
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Loading profile...</CardTitle>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Financial Profile</CardTitle>
          <CardDescription>
            Update your financial information to get personalized advice from our AI assistant.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="monthlyIncome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Monthly Income ($)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="5000" {...field} />
                    </FormControl>
                    <FormDescription>
                      Your monthly income helps our AI tailor financial advice to your situation.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="riskTolerance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Risk Tolerance</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your risk tolerance" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="low">Low - I prefer safety over high returns</SelectItem>
                        <SelectItem value="medium">Medium - I accept some volatility for better returns</SelectItem>
                        <SelectItem value="high">High - I can tolerate significant market fluctuations</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Your risk tolerance influences the types of investments we recommend.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? 'Updating...' : 'Save Changes'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}