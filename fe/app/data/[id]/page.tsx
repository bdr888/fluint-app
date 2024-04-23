"use client";

import { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";

export default function DataDetails({ params }: { params: { id: string } }) {
  const { id } = params;
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const router = useRouter();

  // todo: use react-query or abstract fetch -or- server render and use suspense
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`http://127.0.0.1:3000/data/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        setData(result);
        setError(null);
      } catch (error) {
        console.error("Fetching error: ", error);
        setError(error.message);
        setData(null);
      }
    }
    fetchData();
  }, [id]);

  // modals
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onOpenChange: onEditOpenChange,
  } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onOpenChange: onDeleteOpenChange,
  } = useDisclosure();

  function handleEdit(updatedData: string) {
    console.log(
      `Updating data with ID: ${data.id} and new data: ${updatedData}`
    );
    fetch(`http://127.0.0.1:3000/data/${data.id}`, {
      method: "PUT",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: updatedData }),
    })
      .then((response) => response.json())
      .then((updated) => {
        console.log("Update successful:", updated);
        setData({ ...data, data: updatedData });
      })
      .catch((error) => {
        console.error("Error updating data:", error);
        setError(error.message);
      });
  }

  function handleDelete(id: string) {
    fetch(`http://127.0.0.1:3000/data/${id}`, {
      method: "DELETE",
      mode: "no-cors",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete the data");
        }
        console.log("Data deleted successfully");
        onDeleteOpenChange();
        router.push("/");
      })
      .catch((error) => {
        console.error("Error deleting data:", error);
        setError(error.message);
        onDeleteOpenChange();
      });
  }

  function EditModal() {
    return (
      <Modal isOpen={isEditOpen} onOpenChange={onEditOpenChange}>
        <ModalContent>
          <Formik
            initialValues={{ data: data.data }}
            onSubmit={(values, { setSubmitting }) => {
              console.log("Submitting form with:", values);
              handleEdit(values.data);
              setSubmitting(false);
              onEditOpenChange();
            }}
          >
            {({ isSubmitting }) => (
              <Form>
                <ModalHeader className="flex flex-col gap-1">
                  Edit data
                </ModalHeader>
                <ModalBody>
                  <Field as={Input} label="Edit Data" name="data" type="text" />
                </ModalBody>
                <ModalFooter>
                  <Button
                    variant="light"
                    onPress={() => onEditOpenChange(false)}
                  >
                    Close
                  </Button>
                  <Button type="submit" color="danger" disabled={isSubmitting}>
                    Submit edit
                  </Button>
                </ModalFooter>
              </Form>
            )}
          </Formik>
        </ModalContent>
      </Modal>
    );
  }

  function DeleteModal() {
    return (
      <Modal isOpen={isDeleteOpen} onOpenChange={onDeleteOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Delete data
              </ModalHeader>
              <ModalBody>
                <p>Permanently delete this data? This cannot be undone.</p>
                <p className="bg-red-200 p-2 rounded-lg">{data.data}</p>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="danger" onPress={() => handleDelete(data.id)}>
                  Delete
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-16">
      <div className="text-lg font-semibold">Data details</div>
      {error ? (
        <div className="text-red-500 min-h-screen">
          Failed to load data: {error}
        </div>
      ) : data ? (
        <div
          key={data?.id}
          className="mt-8 flex-col min-h-screen h-200 border-slate-200 p-2 w-full items-center justify-between"
        >
          <div className="p-2">{data?.data}</div>
          <div className="flex">
            <div className="p-2">
              <Button color="warning" variant="bordered" onPress={onEditOpen}>
                Edit
              </Button>
              <EditModal />
            </div>
            <div className="p-2">
              <>
                <Button onPress={onDeleteOpen} color="danger">
                  Delete
                </Button>
                <DeleteModal />
              </>
            </div>
          </div>
        </div>
      ) : (
        <div className="min-h-screen">Loading...</div>
      )}
    </main>
  );
}
