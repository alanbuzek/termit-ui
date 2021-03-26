import * as React from "react";
import {RouteComponentProps, withRouter} from "react-router";
import {injectIntl} from "react-intl";
import VocabularyUtils, {IRI} from "../../util/VocabularyUtils";
import Utils from "../../util/Utils";
import ContentDetail from "../file/FileContentDetail";
import {connect} from "react-redux";
import {ThunkDispatch} from "../../util/Types";
import {loadLatestTextAnalysisRecord, loadResource} from "../../action/AsyncActions";
import Resource, {EMPTY_RESOURCE} from "../../model/Resource";
import File from "../../model/File";
import TermItState from "../../model/TermItState";
import {TextAnalysisRecord} from "../../model/TextAnalysisRecord";
import {Label} from "reactstrap";
import withI18n, {HasI18n} from "../hoc/withI18n";
import {popRoutingPayload} from "../../action/SyncActions";
import Routes from "../../util/Routes";
import {TextQuoteSelector} from "../../model/TermOccurrence";

interface StoreStateProps {
    resource: Resource;
    routeTransitionPayload: { [key: string]: any };
}

interface DispatchProps {
    loadResource: (resourceIri: IRI) => void;
    loadLatestTextAnalysisRecord: (resourceIri: IRI) => Promise<TextAnalysisRecord | null>;
    popRoutingPayload: () => void;
}

type ResourceFileDetailProps = StoreStateProps & DispatchProps & RouteComponentProps<any> & HasI18n;

interface ResourceFileDetailState {
    vocabularyIri?: IRI | null;
    scrollToSelector?: TextQuoteSelector;
}

export class ResourceFileDetail extends React.Component<ResourceFileDetailProps, ResourceFileDetailState> {
    constructor(props: ResourceFileDetailProps) {
        super(props);
        this.state = {
            vocabularyIri: this.getVocabularyIri(),
            scrollToSelector: props.routeTransitionPayload[Routes.annotateFile.name] ?
                props.routeTransitionPayload[Routes.annotateFile.name].selector : undefined
        };
    }

    public componentDidMount() {
        this.props.loadResource(this.getFileIri());
        if (!this.state.vocabularyIri && Utils.getPrimaryAssetType(this.props.resource) === VocabularyUtils.FILE) {
            this.loadLatestTextAnalysisRecord();
        }
        this.props.popRoutingPayload();
    }

    public componentDidUpdate(prevProps: Readonly<ResourceFileDetailProps>): void {
        if (this.hasResourceIriChanged(prevProps)) {
            this.props.loadResource(this.getFileIri());
            this.setState({vocabularyIri: undefined});
            return;
        }
        if (this.shouldLoadVocabularyIri(prevProps)) {
            const vocabularyIri = this.getVocabularyIri();
            if (vocabularyIri) {
                this.setState({vocabularyIri});
            } else {
                this.loadLatestTextAnalysisRecord();
            }
        }
    }

    private hasResourceIriChanged(prevProps: Readonly<ResourceFileDetailProps>) {
        return this.props.match.params.fileName !== prevProps.match.params.fileName || this.props.location.search !== prevProps.location.search;
    }

    private shouldLoadVocabularyIri(prevProps: Readonly<ResourceFileDetailProps>) {
        const {resource} = this.props;
        return resource && resource !== EMPTY_RESOURCE &&
            (!prevProps.resource || prevProps.resource === EMPTY_RESOURCE || prevProps.resource.iri !== resource.iri);
    }

    private getFileIri = (): IRI => {
        const normalizedFileName = this.props.match.params.fileName;
        const fileNamespace = Utils.extractQueryParam(this.props.location.search, "fileNamespace");
        return VocabularyUtils.create(fileNamespace + normalizedFileName);
    };

    private getVocabularyIri(): IRI | null {
        if (Utils.getPrimaryAssetType(this.props.resource) !== VocabularyUtils.FILE) {
            return null;
        }
        const file = this.props.resource as File;
        return file.owner && file.owner.vocabulary ? VocabularyUtils.create(file.owner.vocabulary.iri!) : null;
    }

    private loadLatestTextAnalysisRecord() {
        this.props.loadLatestTextAnalysisRecord(this.getFileIri()).then((res: TextAnalysisRecord | null) => {
            if (res) {
                this.setState({vocabularyIri: VocabularyUtils.create(res.vocabularies[0].iri!)});
            } else {
                this.setState({vocabularyIri: null});
            }
        });
    }

    public render() {
        const resource = this.props.resource;
        const vocabularyIri = this.state.vocabularyIri;
        if (resource && resource !== EMPTY_RESOURCE) {
            if (vocabularyIri === undefined) {
                return null;
            }
            if (vocabularyIri === null) {
                // This is temporary, annotator should support vocabulary selection
                return <Label id="file-detail-no-vocabulary"
                              className="italics">{this.props.i18n("file.annotate.unknown-vocabulary")}</Label>
            }
            return <ContentDetail iri={this.getFileIri()}
                                  scrollTo={this.state.scrollToSelector} vocabularyIri={vocabularyIri}/>
        }
        return null;
    }
}

export default connect((state: TermItState) => {
    return {
        resource: state.selectedFile,
        routeTransitionPayload: state.routeTransitionPayload
    }
}, (dispatch: ThunkDispatch) => {
    return {
        loadResource: (resourceIri: IRI) => dispatch(loadResource(resourceIri)),
        loadLatestTextAnalysisRecord: (resourceIri: IRI) => dispatch(loadLatestTextAnalysisRecord(resourceIri)),
        popRoutingPayload: () => dispatch(popRoutingPayload(Routes.annotateFile))
    };
})(injectIntl(withI18n(withRouter(ResourceFileDetail))));
