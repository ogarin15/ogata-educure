type User = {
  id: number;
  name: string;
  email: string;
};

function introduce(user: User): string {
  return `Hi, I'm ${user.name} (${user.email})`;
}

console.log(
  introduce({
    id: 1,
    name: "Taro",
    email: "taro@example.com",
  })
);

interface Animal {
  name: string;
}

interface Dog extends Animal {
  breed: string;
}

// type + & で同じ形を表現
type Dog2 = Animal & {
  breed: string;
};

function describe(dog: Dog): string {
  return `${dog.name} is a ${dog.breed}`;
}

const dog: Dog = {
  name: "Pochi",
  breed: "Shiba",
};

const dog2: Dog2 = {
  name: "Lucky",
  breed: "Corgi",
};

console.log(describe(dog));
console.log(describe(dog2));

type Id = number | string;

function formatId(id: Id): string {
  if (typeof id === "number") {
    return `N:${id}`;
  }

  return `S:${id}`;
}

console.log(formatId(42));
console.log(formatId("abc"));
