import TermItFile from "../../../model/File";
import File from "../../../model/File";
import Utils from "../../../util/Utils";
import { ButtonToolbar, Label, Table } from "reactstrap";
import { useI18n } from "../../hook/useI18n";
import Website from "src/model/Website";

interface FilesProps {
  files: TermItFile[];
  websites: Website[];
  actions: JSX.Element[];
  itemActions: (file: TermItFile) => JSX.Element[];
}

const Files = (props: FilesProps) => {
  const { i18n } = useI18n();
  const files = Utils.sanitizeArray(props.files)
    .slice()
    .sort(Utils.labelComparator);
  const websites = Utils.sanitizeArray(props.websites)
    .slice()
    .sort(Utils.labelComparator);
  return (
    <div>
      <Table>
        <tbody>
          <tr>
            <td>
              <Label className="attribute-label mb-3">
                {" "}
                {i18n("vocabulary.detail.files")}
              </Label>
            </td>
            <td className="fit-content">
              <div className="fit-content">{props.actions}</div>
            </td>
          </tr>
        </tbody>
      </Table>
      {files.length > 0 ? (
        <Table striped={true} bordered={true}>
          <tbody>
            {files.map((v: File) => (
              <tr key={v.label}>
                <td className="align-middle">{v.label}</td>
                <td className="align-middle">
                  <ButtonToolbar className="float-right">
                    {props.itemActions(v)}
                  </ButtonToolbar>
                </td>
              </tr>
            ))}
            {websites.length > 0 ? (
              websites.map((v: Website) => (
                <tr key={v.label}>
                  <td className="align-middle">{v.label}</td>
                  <td className="align-middle">
                    <ButtonToolbar className="float-right">
                      {/* <span>{v.label}</span> */}
                      {/* eslint-disable-next-line jsx-a11y/anchor-has-content */}
                      <a href={v.url} target="_blank" rel="noreferrer">
                        {v.url}
                      </a>
                    </ButtonToolbar>
                  </td>
                </tr>
              ))
            ) : (
              <div id="file-list-empty" className="italics">
                {i18n("resource.metadata.document.websites.empty")}
              </div>
            )}
          </tbody>
        </Table>
      ) : (
        <div id="file-list-empty" className="italics">
          {i18n("resource.metadata.document.files.empty")}
        </div>
      )}
    </div>
  );
};

export default Files;
