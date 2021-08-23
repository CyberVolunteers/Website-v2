import { Flattened } from "combined-validator";
import React, { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import FormComponent, { PerElementValidatorCallbacks } from "./FormComponent";

export default function EditableField({
  name,
  value,
  presentableNames,
  editableFields,
  perElementValidationCallbacks,
  sendEditRequest,
}: {
  presentableNames: { [key: string]: string };
  name: string;
  value: string;
  editableFields: Flattened;
  perElementValidationCallbacks: PerElementValidatorCallbacks;
  sendEditRequest: (name: string, value: any) => void;
}) {
  const [isCurrentlyEdited, setIsCurrentlyEdited] = useState(false);
  const formRef = useRef();

  // check if it is a date
  if (editableFields[name]?.type === "date")
    value = new Date(value).toDateString();

  function submit() {
    // submit
    if (isCurrentlyEdited) {
      const dataRef = formRef?.current as any;

      if (!dataRef?.hasNoErrors()) return sendEditRequest(name, null);
      sendEditRequest(name, dataRef?.getData?.());
    }
    setIsCurrentlyEdited(!isCurrentlyEdited);
  }

  // focus on edit
  useEffect(() => {
    let currentRef: any = formRef?.current;
    if (isCurrentlyEdited && currentRef !== undefined) {
      // find the first element ref to be displayed
      const newRef = currentRef?.elementRef?.current;
      newRef?.focus?.(); //TODO: test this with nested

      // try to set it to submit on enter
      if (typeof newRef === "object")
        newRef.onkeypress = (evt: { keyCode: number }) => {
          // only submit on enter
          if (evt.keyCode === 13) submit();
        };
    }
  }, [isCurrentlyEdited]);

  return (
    <p key={name}>
      <span>
        {(presentableNames as any)[name] ?? name}:
        {isCurrentlyEdited ? (
          <FormComponent
            root={formRef}
            ref={formRef}
            presentableNames={presentableNames}
            perElementValidationCallbacks={perElementValidationCallbacks}
            flattenedValue={editableFields[name]}
            name={name}
            useLabel={false}
          ></FormComponent>
        ) : (
          value
        )}
      </span>
      {/* check that it can be edited */}
      {(() => {
        if (name in editableFields)
          return (
            <span style={{ cursor: "pointer" }} onClick={submit}>
              {isCurrentlyEdited ? "<submit icon>" : "<edit icon>"}
            </span>
          );
      })()}
    </p>
  );
}
