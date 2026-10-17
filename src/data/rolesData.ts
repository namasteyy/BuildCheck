import { RoleConfig, RoleType } from '../types';

export const ROLES_DATA: Record<RoleType, RoleConfig> = {
  swe: {
    id: 'swe',
    title: 'Backend Engineering Intern',
    shortTitle: 'Backend Intern',
    badge: 'Golang / Redis / Distributed Systems',
    sprintName: 'Sprint #4: High-Throughput Redis Sliding Window Rate Limiter',
    matchScore: 94,
    vectorDistance: 0.0588,
    candidateName: 'Kabir Mehra',
    candidateEducation: "B.Tech CSE '26 • IIIT Delhi",
    description: 'Implement an atomic sliding window rate limiter in Go with Redis Lua scripts, handling 15,000 req/sec with P99 < 1.8ms.',
    skills: ['Go 1.23', 'Redis v7 Lua', 'Distributed Concurrency', 'Chaos Testing', 'gRPC / Protobuf'],
    metrics: [
      { label: 'Throughput', value: '16.4k rps', status: 'optimal' },
      { label: 'P99 Latency', value: '1.42 ms', status: 'optimal' },
      { label: 'Test Coverage', value: '98.4%', status: 'good' },
      { label: 'Memory Leak Audit', value: 'Clean (0 allocs/op)', status: 'good' },
    ],
    files: [
      {
        name: 'limiter.go',
        language: 'go',
        content: `package ratelimit

import (
	"context"
	_ "embed"
	"time"
	"github.com/redis/go-redis/v9"
)

//go:embed sliding_window.lua
var slidingWindowLuaScript string

type SlidingWindowLimiter struct {
	client *redis.Client
	sha    string
}

func NewSlidingWindowLimiter(rdb *redis.Client) (*SlidingWindowLimiter, error) {
	sha, err := rdb.ScriptLoad(context.Background(), slidingWindowLuaScript).Result()
	if err != nil {
		return nil, err
	}
	return &SlidingWindowLimiter{client: rdb, sha: sha}, nil
}

// Allow checks if the key has exceeded maxRequests within windowDuration
func (l *SlidingWindowLimiter) Allow(ctx context.Context, key string, maxRequests int64, window time.Duration) (bool, error) {
	now := time.Now().UnixNano()
	clearBefore := now - window.Nanoseconds()
	
	res, err := l.client.EvalSha(ctx, l.sha, []string{key}, now, clearBefore, maxRequests, window.Seconds()).Int()
	if err != nil {
		return false, err
	}
	return res == 1, nil
}`,
      },
      {
        name: 'sliding_window.lua',
        language: 'lua',
        content: `-- Redis Lua Script for Atomic Sliding Window
local key = KEYS[1]
local now = tonumber(ARGV[1])
local clearBefore = tonumber(ARGV[2])
local maxRequests = tonumber(ARGV[3])
local windowSec = tonumber(ARGV[4])

-- 1. Remove timestamps outside the sliding window
redis.call('ZREMRANGEBYSCORE', key, 0, clearBefore)

-- 2. Count current elements in window
local currentCount = redis.call('ZCARD', key)

if currentCount < maxRequests then
    -- 3. Add current timestamp with unique score
    redis.call('ZADD', key, now, now)
    redis.call('EXPIRE', key, math.ceil(windowSec) + 1)
    return 1
else
    return 0
end`,
      },
      {
        name: 'limiter_chaos_test.go',
        language: 'go',
        content: `package ratelimit_test

import (
	"context"
	"sync"
	"sync/atomic"
	"testing"
	"time"
)

func TestSlidingWindow_HighConcurrencyChaos(t *testing.T) {
	limiter := setupTestLimiter(t)
	key := "candidate_verify:user_98124"
	var allowed, rejected int64
	var wg sync.WaitGroup

	// Blast 1,000 concurrent goroutines
	for i := 0; i < 1000; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			ok, _ := limiter.Allow(context.Background(), key, 250, 1*time.Second)
			if ok {
				atomic.AddInt64(&allowed, 1)
			} else {
				atomic.AddInt64(&rejected, 1)
			}
		}()
	}
	wg.Wait()

	if allowed != 250 {
		t.Fatalf("Expected strictly 250 allowed, got %d", allowed)
	}
	t.Logf("PASS: Exactly 250 allowed, 750 throttled. Atomic integrity preserved.")
}`,
      },
    ],
    logs: [
      { timestamp: '14:22:01.104', type: 'vector', message: 'pgvector query: SELECT 1 - (embedding <=> $1) FROM candidate_work_samples;' },
      { timestamp: '14:22:01.120', type: 'info', message: 'Match affinity score computed: 0.9412 (Distance: 0.0588)' },
      { timestamp: '14:22:03.450', type: 'info', message: 'Sandbox runner initialized: container id "vf-go-sandbox-819"' },
      { timestamp: '14:22:04.112', type: 'info', message: 'Running go test -race -v -bench=. ./...' },
      { timestamp: '14:22:05.789', type: 'success', message: '=== RUN   TestSlidingWindow_HighConcurrencyChaos' },
      { timestamp: '14:22:06.012', type: 'success', message: '--- PASS: TestSlidingWindow_HighConcurrencyChaos (0.18s)' },
      { timestamp: '14:22:06.104', type: 'success', message: 'BenchmarkSlidingWindow-8: 16,420 ops/sec (P99 1.42ms, 0 allocs/op)' },
      { timestamp: '14:22:06.250', type: 'vector', message: 'Autonomous Verification: Work sample validated against enterprise rubric.' },
    ],
    vectorBreakdown: [
      { dimension: 'Concurrency & Thread Safety', score: 96, benchmark: 88 },
      { dimension: 'Algorithmic Efficiency (P99)', score: 95, benchmark: 85 },
      { dimension: 'Data Stores & Redis Caching', score: 94, benchmark: 82 },
      { dimension: 'Test Robustness & Chaos', score: 92, benchmark: 80 },
    ],
  },
  pm: {
    id: 'pm',
    title: 'Product Management Intern',
    shortTitle: 'PM Intern',
    badge: 'PRD / User Journeys / SaaS Unit Economics',
    sprintName: 'Sprint #2: Enterprise Multi-Tenant Governance PRD',
    matchScore: 92,
    vectorDistance: 0.0782,
    candidateName: 'Kabir Mehra',
    candidateEducation: "B.Tech CSE '26 • IIIT Delhi",
    description: 'Draft comprehensive PRD and functional permission matrix for granular RBAC with audit logging across 10,000+ enterprise seats.',
    skills: ['Enterprise RBAC', 'Customer Discovery Synthesis', 'Figma Wireframing', 'SOC2 Compliance', 'SQL Analytics'],
    metrics: [
      { label: 'PRD Completeness', value: '96.2%', status: 'optimal' },
      { label: 'Edge Cases Spec', value: '18/18 mapped', status: 'optimal' },
      { label: 'TAM/SAM Projection', value: '$4.2M ARR', status: 'good' },
      { label: 'Dev Effort Est.', value: '6 Sprints (accurate)', status: 'good' },
    ],
    files: [
      {
        name: 'PRD_Governance_v2.md',
        language: 'markdown',
        content: `# PRD: Enterprise Multi-Tenant RBAC & Compliance Suite
**Author**: Kabir Mehra (APM Intern Work-to-Match Sprint)
**Target Release**: Q3 Enterprise Cohort

## 1. Problem Statement
Enterprise accounts ($100k+ ACV) currently block deployment due to flat admin roles. Security teams require:
1. Strict segregation of duties (SOC2 Type II CC6.1).
2. Just-In-Time (JIT) role elevation with Slack approval workflows.
3. Immutable append-only audit trail exporting to Datadog/Splunk via S3 bucket sinks.

## 2. User Personas
- **Chief Information Security Officer (CISO)**: Needs compliance certifications and zero-trust policy enforcement.
- **Tenant Workspace Admin**: Manages 500+ developers without filing IT tickets for everyday permission grants.
- **Auditor**: Generates single-click CSV and JSON tamper-evident reports.

## 3. Success Metrics (KPIs)
- Enterprise Deal Cycle Acceleration: -28% days in security review.
- Adoption Rate: >85% of tier-1 enterprise orgs configuring custom roles within 30 days.
- Support Escalations: <1.2% permission denial tickets.`,
      },
      {
        name: 'Permission_Matrix.json',
        language: 'json',
        content: `{
  "role_hierarchy": {
    "org_owner": {
      "inherits": ["workspace_admin", "billing_admin"],
      "privileges": ["org:delete", "org:sso_saml_configure", "org:audit_export"]
    },
    "workspace_admin": {
      "inherits": ["team_lead"],
      "privileges": ["member:invite", "member:revoke", "environment:provision"]
    },
    "compliance_auditor": {
      "inherits": [],
      "privileges": ["audit:read_stream", "reports:generate_immutable_export"]
    }
  },
  "jit_elevation_rules": {
    "prod_db_access": {
      "max_duration_minutes": 120,
      "requires_approval_from": ["security_oncall"],
      "mfa_required": true
    }
  }
}`,
      },
      {
        name: 'User_Interview_Synthesis.md',
        language: 'markdown',
        content: `### Enterprise Customer Synthesis (12 Interviews Analyzed)

Key Insights from Fintech & HealthTech Leads:
1. "SSO is not enough; we need SCIM auto-deprovisioning within 60 seconds of Okta suspension."
2. "Audit logs must record the client IP, TLS session fingerprint, and reason code."
3. "Self-serve team creation prevents shadow IT without compromising root organization boundary."`,
      },
    ],
    logs: [
      { timestamp: '14:22:01.090', type: 'vector', message: 'pgvector query: SELECT 1 - (embedding <=> $1) FROM candidate_work_samples;' },
      { timestamp: '14:22:01.115', type: 'info', message: 'Match affinity score computed: 0.9218 (Distance: 0.0782)' },
      { timestamp: '14:22:02.890', type: 'info', message: 'Autonomous LLM Evaluator analyzing PRD document ontology...' },
      { timestamp: '14:22:04.220', type: 'success', message: 'Rubric check: Problem definition & business justification: 98%' },
      { timestamp: '14:22:04.980', type: 'success', message: 'Rubric check: User journey edge-cases & error states: 94%' },
      { timestamp: '14:22:05.410', type: 'success', message: 'Rubric check: Engineering feasibility & technical scoping: 92%' },
      { timestamp: '14:22:06.100', type: 'vector', message: 'Semantic Match: Candidate is in top 6th percentile for Enterprise B2B PRD quality.' },
    ],
    vectorBreakdown: [
      { dimension: 'Customer Empathy & Discovery', score: 94, benchmark: 82 },
      { dimension: 'Technical Depth & Feasibility', score: 91, benchmark: 78 },
      { dimension: 'Business KPIs & Go-To-Market', score: 93, benchmark: 80 },
      { dimension: 'Compliance & Edge Case Mapping', score: 95, benchmark: 76 },
    ],
  },
  devops: {
    id: 'devops',
    title: 'DevOps / Infra Intern',
    shortTitle: 'DevOps Intern',
    badge: 'Terraform / Kubernetes / CI/CD Automation',
    sprintName: 'Sprint #3: Ephemeral Preview Environments via Terraform & K8s',
    matchScore: 95,
    vectorDistance: 0.0482,
    candidateName: 'Kabir Mehra',
    candidateEducation: "B.Tech CSE '26 • IIIT Delhi",
    description: 'Build automated Terraform IaC and GitHub Actions pipeline to spin up isolated Kubernetes preview clusters on every PR with automatic TTL teardown.',
    skills: ['Terraform HCL', 'Kubernetes Helm v3', 'GitHub Actions', 'AWS EKS / VPC', 'Cost Optimization'],
    metrics: [
      { label: 'Cluster Cold Start', value: '38 seconds', status: 'optimal' },
      { label: 'Cost Optimization', value: '-32% idle spend', status: 'optimal' },
      { label: 'SOC2 Drift Checks', value: '0 Violations', status: 'good' },
      { label: 'TTL Auto-Teardown', value: '100% Reliable', status: 'good' },
    ],
    files: [
      {
        name: 'main.tf',
        language: 'hcl',
        content: `terraform {
  required_version = ">= 1.7.0"
  required_providers {
    aws = { source = "hashicorp/aws", version = "~> 5.40" }
    kubernetes = { source = "hashicorp/kubernetes", version = "~> 2.28" }
  }
}

variable "pr_number" {
  type        = string
  description = "Pull Request ID triggering ephemeral environment"
}

resource "kubernetes_namespace" "ephemeral_pr" {
  metadata {
    name = "pr-\${var.pr_number}"
    labels = {
      "buildcheck.io/ephemeral" = "true"
      "buildcheck.io/ttl-hours" = "4"
      "environment"               = "preview"
    }
  }
}

resource "kubernetes_resource_quota" "pr_quota" {
  metadata {
    name      = "quota-pr-\${var.pr_number}"
    namespace = kubernetes_namespace.ephemeral_pr.metadata[0].name
  }
  spec {
    hard = {
      "requests.cpu"    = "4"
      "requests.memory" = "8Gi"
      "limits.cpu"      = "8"
      "limits.memory"   = "16Gi"
    }
  }
}`,
      },
      {
        name: 'preview-pipeline.yml',
        language: 'yaml',
        content: `name: Ephemeral Preview Deployment
on:
  pull_request:
    types: [opened, synchronize, reopened, closed]

jobs:
  ephemeral-lifecycle:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Authenticate to AWS EKS
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: arn:aws:iam::123456789012:role/GitHubEphemeralWorker
          aws-region: us-east-1

      - name: Teardown on PR Merge/Close
        if: github.event.action == 'closed'
        run: |
          terraform -chdir=infra destroy -auto-approve -var="pr_number=\${{ github.event.number }}"

      - name: Provision Ephemeral Stack
        if: github.event.action != 'closed'
        run: |
          terraform -chdir=infra apply -auto-approve -var="pr_number=\${{ github.event.number }}"
          helm upgrade --install pr-\${{ github.event.number }} ./charts/preview \\
            --namespace pr-\${{ github.event.number }} \\
            --set image.tag=\${{ github.sha }}`,
      },
      {
        name: 'ttl_janitor.sh',
        language: 'bash',
        content: `#!/usr/bin/env bash
set -euo pipefail

echo "Scanning for expired ephemeral preview namespaces..."
EXPIRED_NS=$(kubectl get ns -l buildcheck.io/ephemeral=true -o json | jq -r '
  .items[] | 
  select((now - (.metadata.creationTimestamp | fromdateiso8601)) > 14400) | 
  .metadata.name')

for ns in $EXPIRED_NS; do
  echo "Terminating expired namespace: $ns (exceeded 4hr TTL)"
  kubectl delete ns "$ns" --grace-period=30
done`,
      },
    ],
    logs: [
      { timestamp: '14:22:01.085', type: 'vector', message: 'pgvector query: SELECT 1 - (embedding <=> $1) FROM candidate_work_samples;' },
      { timestamp: '14:22:01.108', type: 'info', message: 'Match affinity score computed: 0.9521 (Distance: 0.0482)' },
      { timestamp: '14:22:02.190', type: 'info', message: 'Validating Terraform configuration syntax with tflint & trivy...' },
      { timestamp: '14:22:03.440', type: 'success', message: 'Terraform Plan: 4 to add, 0 to change, 0 to destroy. Resource quotas strictly enforced.' },
      { timestamp: '14:22:04.120', type: 'success', message: 'Security scan: 0 critical/high CVEs. Namespace isolation compliant.' },
      { timestamp: '14:22:05.105', type: 'success', message: 'Janitor script TTL check: Passed unit simulation.' },
      { timestamp: '14:22:05.900', type: 'vector', message: 'Verified: Candidate demonstrated senior-level automation & cost control mindset.' },
    ],
    vectorBreakdown: [
      { dimension: 'Infrastructure-as-Code (Terraform)', score: 98, benchmark: 84 },
      { dimension: 'Kubernetes Multi-Tenancy & Quotas', score: 96, benchmark: 82 },
      { dimension: 'CI/CD Pipeline Security (OIDC)', score: 94, benchmark: 80 },
      { dimension: 'Cloud FinOps & Cost Efficiency', score: 97, benchmark: 78 },
    ],
  },
};
