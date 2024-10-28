'use client';
// this is a client component

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
// image component from next/image
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast"

interface User {
  //interface keyword defines a contract for an object's shape
  //you specify the properties and methods that an object must have
  //similar to object oriented programming in python, you define a class (class: User)

  // each class has properties and methods
  name: {
    first: string;
    last: string;
  };
  picture: {
    large: string;
  };
  gender: string;
  email: string;
  location: {
    street: {
      number: number;
      name: string;
    };
    city: string;
    state: string;
    country: string;
    postcode: string;
  };
}

const formSchema = z.object({
  userCount: z.number().min(1).max(50)
});

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userCount: 10,
    },
  });

  async function fetchUsers(count: number) {
    try {
      const response = await fetch(`https://randomuser.me/api/?results=${count}`);
      const data = await response.json();
      setUsers(data.results);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await fetchUsers(values.userCount);
      toast({
        title: "Success!",
        description: `Generated ${values.userCount} new users.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate users. Please try again.",
        variant: "destructive",
      });
    }
  }

  useEffect(() => {
    fetchUsers(10); // Initial fetch with 10 users
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Random Users</h1>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mb-8">
          <FormField
            control={form.control}
            name="userCount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number of Users</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    {...field} 
                    onChange={e => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button type="submit">Generate Users</Button>
        </form>
      </Form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((user, index) => (
          <div 
            key={index} 
            className="border p-4 rounded-lg cursor-pointer hover:bg-gray-50"
            onClick={() => setSelectedUser(user)}
          >
            <Image
              src={user.picture.large}
              // src is the source of the image
              // {user.picture.large} is the URL of the image.
              // to get the URL, we need to access the picture property of the user object and then the large property of the picture object. use dot notation.
              alt={`${user.name.first} ${user.name.last}`}
              width={128}
              height={128}
              className="rounded-full"
            />
            <h2 className="mt-2 text-lg">{`${user.name.first} ${user.name.last}`}</h2>
            <p className="text-gray-600">{user.gender}</p>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-md w-full m-4">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold text-black">{`${selectedUser.name.first} ${selectedUser.name.last}`}</h2>
              <button 
                onClick={() => setSelectedUser(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="space-y-2 text-black">
              <p><strong>Email:</strong> {selectedUser.email}</p>
              <p><strong>Address:</strong></p>
              <p className="pl-4">
                {selectedUser.location.street.number} {selectedUser.location.street.name}<br />
                {selectedUser.location.city}, {selectedUser.location.state}<br />
                {selectedUser.location.country} {selectedUser.location.postcode}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
