import React, { useState } from "react";
import {
  FormGroup,
  FileUpload,
  Modal,
  ModalVariant,
  Button,
  FileUploadProps,
} from "@patternfly/react-core";
import { useTranslation } from "react-i18next";

type FileUpload = {
  value: string | File;
  filename: string;
  isLoading: boolean;
  modal: boolean;
};

export type JsonFileUploadEvent =
  | React.DragEvent<HTMLElement> // User dragged/dropped a file
  | React.ChangeEvent<HTMLTextAreaElement> // User typed in the TextArea
  | React.MouseEvent<HTMLButtonElement, MouseEvent>; // User clicked Clear button

export type JsonFileUploadProps = FileUploadProps & {
  id: string;
  onChange: (
    value: string | File,
    filename: string,
    event: JsonFileUploadEvent
  ) => void;
  helpText?: string;
  unWrap?: boolean;
};

export const JsonFileUpload = ({
  id,
  onChange,
  helpText = "common-help:helpFileUpload",
  unWrap = false,
  ...rest
}: JsonFileUploadProps) => {
  const { t } = useTranslation();
  const defaultUpload = {
    value: "",
    filename: "",
    isLoading: false,
    modal: false,
  };
  const [fileUpload, setFileUpload] = useState<FileUpload>(defaultUpload);
  const removeDialog = () => setFileUpload({ ...fileUpload, modal: false });
  const handleChange = (
    value: string | File,
    filename: string,
    event:
      | React.DragEvent<HTMLElement>
      | React.ChangeEvent<HTMLTextAreaElement>
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): void => {
    if (
      event.nativeEvent instanceof MouseEvent &&
      !(event.nativeEvent instanceof DragEvent)
    ) {
      setFileUpload({ ...fileUpload, modal: true });
    } else {
      setFileUpload({
        ...fileUpload,
        value,
        filename,
      });
      onChange(value, filename, event);
    }
  };

  const JsonFileUploadComp = () => (
    <FileUpload
      id={id}
      {...rest}
      type="text"
      value={fileUpload.value}
      filename={fileUpload.filename}
      onChange={handleChange}
      onReadStarted={() => setFileUpload({ ...fileUpload, isLoading: true })}
      onReadFinished={() => setFileUpload({ ...fileUpload, isLoading: false })}
      isLoading={fileUpload.isLoading}
      dropzoneProps={{
        accept: ".json",
      }}
    />
  );

  return (
    <>
      {fileUpload.modal && (
        <Modal
          variant={ModalVariant.small}
          title={t("clearFile")}
          isOpen
          onClose={removeDialog}
          actions={[
            <Button
              key="confirm"
              variant="primary"
              onClick={(event) => {
                setFileUpload(defaultUpload);
                onChange("", "", event);
              }}
            >
              {t("clear")}
            </Button>,
            <Button key="cancel" variant="link" onClick={removeDialog}>
              {t("cancel")}
            </Button>,
          ]}
        >
          {t("clearFileExplain")}
        </Modal>
      )}
      {unWrap && <JsonFileUploadComp />}
      {!unWrap && (
        <FormGroup
          label={t("resourceFile")}
          fieldId={id}
          helperText={t(helpText)}
        >
          <JsonFileUploadComp />
        </FormGroup>
      )}
    </>
  );
};
