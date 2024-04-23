"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Formik, Form, Field } from "formik";

import {
  Modal,
  ModalContent,
  ModalBody,
  Button,
  useDisclosure,
  Input,
  ModalHeader,
  ModalFooter,
} from "@nextui-org/react";

export default function App() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const temp = [
    { id: "1", data: "one one one one one one one one one one one one " },
    { id: "2", data: "two two two two two two two two two two two two " },
    {
      id: "3",
      data: "three three three three three three three three three three ",
    },
  ];

  const revalidatedData = async () => {
    const result = await fetch(`http://127.0.0.01:3000/data`, {
      method: "GET",
      mode: "no-cors",
    });

    console.log(result);

    return result;
  };

  const [loadData, setLoadData] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(temp);

  useEffect(() => {
    if (!loadData) return;

    setLoadData(false);

    revalidatedData().then((res) => {
      setData(res);
    });
  }, [loadData]);

  function handleCreate(data: string) {
    fetch(`http://127.0.0.1:3000/data`, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: data }),
    })
      .then((response) => response.json())
      .then((updated) => {
        console.log("Update successful:", updated);
        setLoadData(true);
      })
      .catch((error) => {
        console.error("Error updating data:", error);
        setError(error.message);
      });
  }

  function AddNewModal() {
    return (
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          <Formik
            initialValues={{ data: "" }}
            onSubmit={(values, { setSubmitting }) => {
              handleCreate(values.data);
              setSubmitting(false);
              onOpenChange();
            }}
          >
            {({ isSubmitting }) => (
              <Form>
                <ModalHeader className="flex flex-col gap-1">
                  Add new data
                </ModalHeader>
                <ModalBody>
                  <Field
                    as={Input}
                    label="Data"
                    name="data"
                    type="text"
                    autoComplete="off"
                  />
                </ModalBody>
                <ModalFooter>
                  <Button variant="light" onPress={() => onOpenChange()}>
                    Close
                  </Button>
                  <Button color="danger" type="submit" disabled={isSubmitting}>
                    Create
                  </Button>
                </ModalFooter>
              </Form>
            )}
          </Formik>
        </ModalContent>
      </Modal>
    );
  }

  // display one data, with link to data details page
  function DataCard({ id, data }) {
    return (
      <div
        key={id}
        className="flex m-2 p-1 w-full justify-between border-gray-400 border-2 rounded-lg"
      >
        <div className="p-2">
          <Link href={`/data/${id}`}>{data}</Link>
        </div>
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-16">
      <div>
        <div className="flex justify-between w-full flex-grow">
          <div className="text-lg font-bold pb-4">All Data</div>
          <Button color="primary" onPress={onOpen}>
            Add new
          </Button>
          <AddNewModal />
        </div>
        {error ? (
          <div className="text-red-500 min-h-screen">
            Failed to load data: {error}
          </div>
        ) : data ? (
          data.map((item) => (
            <DataCard id={item.id} data={item.data} key={item.id} />
          ))
        ) : (
          <div className="min-h-screen">Loading...</div>
        )}
      </div>
    </main>
  );
}
