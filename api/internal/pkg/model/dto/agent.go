package dto

import (
	"github.com/clickvisual/clickvisual/api/internal/pkg/cvdocker/manager"
)

type AgentSearchTargetInfo struct {
	K8sInfo  *manager.K8SInfo
	FilePath string
}
