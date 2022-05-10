import TermItFile from "../../../model/File";
import File from "../../../model/File";
import Utils from "../../../util/Utils";
import { ButtonToolbar, Label, Table } from "reactstrap";
import { useI18n } from "../../hook/useI18n";
import Website from "src/model/Website";

interface OccurrencesSourcesProps {
  files: TermItFile[];
  websites: Website[];
  actions: JSX.Element[];
  fileItemActions: (file: TermItFile) => JSX.Element[];
}

const OccurrenceSources = (props: OccurrencesSourcesProps) => {
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
      <Table striped={true} bordered={true}>
        <tbody>
          {files.map((v: File) => (
            <tr key={v.label}>
              <td className="align-middle">{v.label}</td>
              <td className="align-middle">
                <ButtonToolbar className="float-right">
                  {props.fileItemActions(v)}
                </ButtonToolbar>
              </td>
            </tr>
          ))}
        </tbody>
        {websites.map((website: Website) => (
          <tr key={website.label}>
            <td className="align-middle">{website.label}</td>
            <td className="align-middle">
              <ButtonToolbar className="float-right">
                <a
                  href={website.url}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-primary btn-sm"
                >
                  {i18n("resource.metadata.website.content")}
                  <small style={{ marginLeft: 5 }}>
                    <i className="fas fa-external-link-alt text-black" />
                  </small>
                </a>
              </ButtonToolbar>
            </td>
          </tr>
        ))}
        {!websites.length && !files.length && (
          <div id="file-list-empty" className="italics">
            {i18n("resource.metadata.document.files.empty")}
          </div>
        )}
      </Table>
    </div>
  );
};

export default OccurrenceSources;
