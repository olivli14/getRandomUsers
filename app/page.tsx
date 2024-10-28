'use client';
// this is a client component

import { useEffect, useState } from 'react';
import Image from 'next/image';
// image component from next/image

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
}

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);
  // useState is a hook. add state to your functional component
  // returns an array with two elements: the current state value and a function that allows you to update that value
  // store an array of User objects (defined above as an interface)

  // useEffect is a hook. it allows you to perform side effects in your functional component
  // side effects are actions that are not directly related to rendering the UI
  // in this case, we are fetching data from an API

  useEffect(() => {
    async function fetchUsers() {
      try{
        const response = await fetch('https://randomuser.me/api/?results=10');
        // we get the data from the API

        const data = await response.json();
        //The fetch API returns a Response object
        // response.json() converts the response body into JSON format

        setUsers(data.results);
        // update the users state with the data from the API

        // setUsers is a function that allows us to update the users state
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    }
    fetchUsers();
  }, []);
  // empty array as the second argument means that the effect will only run once when the component is mounted


  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Random Users</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((user, index) => (
          // map is used to iterate over an array and return a new array
          // iterate over the users array and return a new array of JSX elements
          <div key={index} className="border p-4 rounded-lg">
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
    </div>
  );

}
